import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const BUILTINS = new Set([
  'string',
  'number',
  'boolean',
  'bigint',
  'symbol',
  'undefined',
  'null',
  'void',
  'any',
  'unknown',
  'never',
  'object',
  'HTMLElement',
  'Promise',
  'Array',
  'ReadonlyArray',
  'Record',
  'Map',
  'Set',
  'Date',
  'Error',
  'Uint8Array',
  'Partial',
  'Required',
  'Pick',
  'Omit',
  'Exclude',
  'Extract',
  'NonNullable',
  'ReturnType',
  'Parameters',
  'Readonly',
  'Function',
  'Object',
  'String',
  'Number',
  'Boolean',
]);

const MAX_FIELDS = 40;
const MAX_DEPTH = 2;

function collectDts(dir, acc = []) {
  return readdir(dir, { withFileTypes: true }).then(async (entries) => {
    await Promise.all(
      entries.map(async (entry) => {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (entry.name === 'node_modules') return;
          await collectDts(full, acc);
          return;
        }

        if (entry.name.endsWith('.d.ts')) acc.push(full);
      }),
    );

    return acc;
  });
}

function packageName(fileName) {
  const normalized = fileName.split(path.sep).join('/');
  const marker = '/node_modules/';
  const index = normalized.lastIndexOf(marker);

  if (index < 0) return null;

  const rest = normalized.slice(index + marker.length);
  const parts = rest.split('/');

  if (parts[0] === '@types') return parts[1] || null;
  if (parts[0].startsWith('@')) return `${parts[0]}/${parts[1]}`;

  return parts[0];
}

function isExportedStatement(node) {
  return (
    ts.canHaveModifiers(node) &&
    ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  );
}

function commentBlock(decl) {
  const source = decl.getSourceFile().text;
  const trivia = source.slice(decl.getFullStart(), decl.getStart());
  const match = trivia.match(/\/\*\*[\s\S]*?\*\//);

  return match ? match[0] : '';
}

function propertyDeclaration(prop) {
  return prop.declarations?.find(
    (decl) => ts.isPropertySignature(decl) || ts.isPropertyDeclaration(decl),
  );
}

/**
 * Rewrites published function parameters so editor hover lists every field.
 * Named interfaces such as `IConfig` stay exported for `import type`, but a
 * parameter typed as that interface is expanded to the object itself — otherwise
 * hover only shows the name, and `package.json` `exports` hides the file the
 * name points at.
 */
export async function inlinePublicTypes(distDir = 'dist') {
  const root = path.resolve(distDir);
  const files = await collectDts(root);

  if (!files.length) return;

  const program = ts.createProgram(files, {
    noEmit: true,
    strict: true,
    skipLibCheck: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
    moduleResolution: ts.ModuleResolutionKind.Node10,
  });
  const checker = program.getTypeChecker();

  await Promise.all(files.map((file) => inlineFile(program, checker, file, root)));
}

function inlineFile(program, checker, file, distDir) {
  const source = program.getSourceFile(file);

  if (!source) return Promise.resolve();

  const inScope = namesInScope(source);
  const edits = [];

  for (const statement of source.statements) {
    if (!isExportedStatement(statement)) continue;

    if (
      ts.isTypeAliasDeclaration(statement) &&
      !statement.typeParameters &&
      statement.type &&
      (ts.isTypeReferenceNode(statement.type) ||
        ts.isIntersectionTypeNode(statement.type) ||
        ts.isImportTypeNode(statement.type))
    ) {
      const rendered = renderObject(
        checker.getTypeFromTypeNode(statement.type),
        0,
        new Set(),
      );

      if (rendered && rendered.text !== statement.type.getText()) {
        edits.push({
          start: statement.type.getStart(source),
          end: statement.type.getEnd(),
          text: rendered.text,
          imports: rendered.imports,
        });
      }
    }

    walk(statement);
  }

  if (!edits.length) return Promise.resolve();

  edits.sort((a, b) => b.start - a.start);

  let text = source.text;

  for (const edit of edits) {
    text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
  }

  const imports = mergeImports(edits.flatMap((edit) => edit.imports));
  const missing = imports.filter((item) => !inScope.has(item.name));

  if (missing.length) {
    text = insertImports(text, missing) + text;
  }

  if (text === source.text) return Promise.resolve();

  return writeFile(file, text);

  function walk(node) {
    if (
      ts.isFunctionTypeNode(node) ||
      ts.isFunctionDeclaration(node) ||
      ts.isMethodSignature(node) ||
      ts.isCallSignatureDeclaration(node) ||
      ts.isConstructorTypeNode(node)
    ) {
      for (const param of node.parameters) {
        if (!param.type) continue;
        if (
          !ts.isTypeReferenceNode(param.type) &&
          !ts.isImportTypeNode(param.type)
        ) {
          continue;
        }

        const rendered = renderObject(
          checker.getTypeFromTypeNode(param.type),
          0,
          new Set(),
        );

        if (!rendered) continue;

        edits.push({
          start: param.type.getStart(source),
          end: param.type.getEnd(),
          text: rendered.text,
          imports: rendered.imports,
        });
      }

      return;
    }

    ts.forEachChild(node, walk);
  }

  function renderObject(type, depth, seen) {
    if (!type || seen.has(type) || depth > MAX_DEPTH) return null;
    if (type.flags & (ts.TypeFlags.Union | ts.TypeFlags.Never)) return null;
    if (type.getCallSignatures().length || type.getConstructSignatures().length) {
      return null;
    }

    const objectFlags = type.objectFlags ?? 0;

    if (objectFlags & (ts.ObjectFlags.Mapped | ts.ObjectFlags.Tuple)) return null;

    const symbolName = type.symbol?.getName();

    if (
      symbolName === 'Array' ||
      symbolName === 'ReadonlyArray' ||
      symbolName === 'Promise'
    ) {
      return null;
    }

    const props = type.getProperties();

    if (!props.length || props.length > MAX_FIELDS) return null;

    const fields = [];

    for (const prop of props) {
      const decl = propertyDeclaration(prop);

      if (!decl?.type) return null;
      if (!isOwnedFile(decl.getSourceFile().fileName, distDir)) return null;

      fields.push({ prop, decl });
    }

    const nextSeen = new Set(seen);

    nextSeen.add(type);

    const indent = depth * 4;
    const pad = ' '.repeat(indent);
    const inner = ' '.repeat(indent + 4);
    const lines = ['{'];
    const imports = [];

    for (const { prop, decl } of fields) {
      const comment = commentBlock(decl);

      if (comment) {
        for (const line of comment.split('\n')) {
          const trimmed = line.trim();

          if (!trimmed) continue;

          const body =
            trimmed.startsWith('*') && !trimmed.startsWith('/**')
              ? ` ${trimmed}`
              : trimmed;

          lines.push(inner + body);
        }
      }

      const optional = prop.flags & ts.SymbolFlags.Optional ? '?' : '';
      const readonly =
        ts.isPropertySignature(decl) &&
        decl.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ReadonlyKeyword)
          ? 'readonly '
          : '';
      const name = decl.name.getText();
      let typeText = decl.type.getText().replace(/\bLooseString\b/g, '(string & {})');
      const propType = checker.getTypeFromTypeNode(decl.type);
      const nested =
        depth < MAX_DEPTH ? renderObject(propType, depth + 1, nextSeen) : null;

      const collected = nested ? nested.imports : importsFor(decl.type);

      if (collected.some((item) => item.error)) return null;

      if (nested) typeText = nested.text;

      imports.push(...collected);

      lines.push(`${inner}${readonly}${name}${optional}: ${typeText};`);
    }

    lines.push(`${pad}}`);

    return { text: lines.join('\n'), imports };
  }

  function importsFor(typeNode) {
    const found = [];

    function visit(node) {
      if (ts.isImportTypeNode(node)) return;

      if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
        const name = node.typeName.text;

        if (!BUILTINS.has(name) && name !== 'LooseString') {
          const symbol = checker.getSymbolAtLocation(node.typeName);

          if (symbol) found.push(symbol);
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(typeNode);

    return found.flatMap((symbol) => {
      const resolved = specifierFor(symbol, checker, file, distDir);

      if (!resolved || resolved.local) return [];
      if (resolved.error) return [{ name: symbol.getName(), spec: null, error: true }];

      return [{ name: symbol.getName(), spec: resolved.spec }];
    });
  }
}

function isOwnedFile(fileName, distDir) {
  const normalized = path.resolve(fileName);

  if (normalized.startsWith(path.resolve(distDir) + path.sep)) return true;

  const asPosix = normalized.split(path.sep).join('/');

  return (
    asPosix.includes('/node_modules/@bluxcc/core/') ||
    asPosix.includes('/node_modules/@bluxcc/react/')
  );
}

function specifierFor(symbol, checker, fromFile, distDir) {
  let resolved = symbol;

  if (resolved.flags & ts.SymbolFlags.Alias) {
    resolved = checker.getAliasedSymbol(resolved);
  }

  const declaration = resolved.declarations?.find(
    (decl) =>
      ts.isInterfaceDeclaration(decl) ||
      ts.isTypeAliasDeclaration(decl) ||
      ts.isEnumDeclaration(decl) ||
      ts.isClassDeclaration(decl),
  ) ?? resolved.declarations?.[0];

  if (!declaration) return { error: true };

  const fileName = declaration.getSourceFile().fileName;

  if (path.resolve(fileName) === path.resolve(fromFile)) return { local: true };

  const insidePackage =
    isOwnedFile(fileName, distDir) &&
    !fileName.includes(`${path.sep}node_modules${path.sep}`);

  if (insidePackage) {
    let relative = path
      .relative(path.dirname(fromFile), fileName)
      .split(path.sep)
      .join('/')
      .replace(/\.d\.ts$/, '');

    if (!relative.startsWith('.')) relative = `./${relative}`;

    return { spec: relative };
  }

  const pkg = packageName(fileName);

  if (!pkg) return { error: true };

  return { spec: pkg };
}

function namesInScope(source) {
  const names = new Set(BUILTINS);

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause) continue;

    const clause = statement.importClause;

    if (clause.name) names.add(clause.name.text);

    const bindings = clause.namedBindings;

    if (bindings && ts.isNamespaceImport(bindings)) names.add(bindings.name.text);

    if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements) names.add(element.name.text);
    }
  }

  return names;
}

function mergeImports(items) {
  const byKey = new Map();

  for (const item of items) {
    if (!item?.spec || item.error) continue;
    byKey.set(`${item.spec}::${item.name}`, item);
  }

  return [...byKey.values()];
}

function insertImports(sourceText, items) {
  const groups = new Map();

  for (const item of items) {
    const list = groups.get(item.spec) ?? [];

    list.push(item.name);
    groups.set(item.spec, list);
  }

  const lines = [...groups.entries()]
    .map(([spec, names]) => {
      const unique = [...new Set(names)].sort();

      return `import type { ${unique.join(', ')} } from '${spec}';\n`;
    })
    .join('');

  return lines;
}

export function inlinePublicTypesPlugin(dir = 'dist') {
  return {
    name: 'inline-public-types',
    async writeBundle() {
      await inlinePublicTypes(dir);
    },
  };
}
