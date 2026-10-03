import { readdir, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const MAX_FIELDS = 40;
const MAX_DEPTH = 2;
const printer = ts.createPrinter();
const compilerOptions = {
  noEmit: true,
  strict: true,
  exactOptionalPropertyTypes: true,
  skipLibCheck: false,
  esModuleInterop: true,
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2020,
  moduleResolution: ts.ModuleResolutionKind.Node10,
};

async function collectDts(dir) {
  const files = await Promise.all(
    (await readdir(dir, { withFileTypes: true })).map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return entry.name === 'node_modules' ? [] : collectDts(full);
      }
      return entry.name.endsWith('.d.ts') ? [full] : [];
    }),
  );
  return files.flat().sort();
}

function createProgram(files, contents = new Map()) {
  const host = ts.createCompilerHost(compilerOptions);
  const readFile = host.readFile;
  host.readFile = (file) => contents.get(path.resolve(file)) ?? readFile(file);
  return ts.createProgram(files, compilerOptions, host);
}

function assertValid(program, files, semantic = true) {
  const diagnostics = files.flatMap((file) => {
    const source = program.getSourceFile(file);
    return [
      ...program.getSyntacticDiagnostics(source),
      ...(semantic ? program.getSemanticDiagnostics(source) : []),
    ];
  });
  if (diagnostics.length) {
    throw new Error(
      'Invalid published TypeScript declarations:\n' +
        ts.formatDiagnostics(diagnostics, {
          getCanonicalFileName: (file) => file,
          getCurrentDirectory: () => process.cwd(),
          getNewLine: () => '\n',
        }),
    );
  }
}

export async function validatePublicTypes(distDir = 'dist') {
  const files = await collectDts(await realpath(distDir));
  if (!files.length)
    throw new Error(`No TypeScript declarations in ${distDir}`);
  assertValid(createProgram(files), files);
}

/** Expand owned object types for editor hints without changing their meaning. */
export async function inlinePublicTypes(distDir = 'dist') {
  const root = await realpath(distDir);
  const files = await collectDts(root);
  if (!files.length)
    throw new Error(`No TypeScript declarations in ${distDir}`);

  const program = createProgram(files);
  assertValid(program, files, false);
  const checker = program.getTypeChecker();
  const contents = new Map(
    files.map((file) => [file, inlineFile(program, checker, file, root)]),
  );

  // Check the final declarations before writing any of them. skipLibCheck in
  // the source build otherwise hides missing imports and lost generic types.
  assertValid(createProgram(files, contents), files);
  await Promise.all(
    files.map((file) =>
      contents.get(file) === program.getSourceFile(file).text
        ? undefined
        : writeFile(file, contents.get(file)),
    ),
  );
}

function inlineFile(program, checker, file, distDir) {
  const source = program.getSourceFile(file);
  const edits = [];
  const publicPaths = new Map();

  for (const statement of source.statements) {
    if (
      !ts
        .getModifiers(statement)
        ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      continue;
    }

    if (
      ts.isTypeAliasDeclaration(statement) &&
      !statement.typeParameters &&
      (ts.isTypeReferenceNode(statement.type) ||
        ts.isIntersectionTypeNode(statement.type) ||
        ts.isImportTypeNode(statement.type))
    ) {
      const rendered = renderObject(
        checker.getTypeFromTypeNode(statement.type),
        statement,
        0,
        new Set(),
      );
      if (rendered && rendered !== statement.type.getText(source)) {
        addEdit(statement.type, rendered);
        // Child edits would overlap the replacement and corrupt its offsets.
        continue;
      }
    }
    walk(statement);
  }

  let text = source.text;
  let boundary = text.length;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    if (edit.end > boundary)
      throw new Error(`Overlapping type edits in ${file}`);
    text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
    boundary = edit.start;
  }
  return withRelativeExtensions(text, file);

  function addEdit(node, text) {
    edits.push({ start: node.getStart(source), end: node.getEnd(), text });
  }

  function walk(node) {
    if (ts.isTypeLiteralNode(node)) return;
    if (
      ts.isFunctionTypeNode(node) ||
      ts.isFunctionDeclaration(node) ||
      ts.isMethodSignature(node) ||
      ts.isCallSignatureDeclaration(node) ||
      ts.isConstructorTypeNode(node)
    ) {
      for (const param of node.parameters) {
        if (
          !param.type ||
          (!ts.isTypeReferenceNode(param.type) &&
            !ts.isImportTypeNode(param.type))
        ) {
          continue;
        }
        const rendered = renderObject(
          checker.getTypeFromTypeNode(param.type),
          param,
          0,
          new Set(),
        );
        if (rendered) addEdit(param.type, rendered);
      }
      return;
    }
    ts.forEachChild(node, walk);
  }

  function renderObject(type, context, depth, seen) {
    if (!type || seen.has(type) || depth > MAX_DEPTH) return null;
    if (
      type.flags &
      (ts.TypeFlags.Union | ts.TypeFlags.Never | ts.TypeFlags.TypeParameter)
    ) {
      return null;
    }
    if (
      type.getCallSignatures().length ||
      type.getConstructSignatures().length ||
      checker.getIndexInfosOfType(type).length
    )
      return null;
    if (
      (type.objectFlags ?? 0) &
      (ts.ObjectFlags.Mapped | ts.ObjectFlags.Tuple)
    )
      return null;
    if (['Array', 'ReadonlyArray', 'Promise'].includes(type.symbol?.getName()))
      return null;

    const props = type.getProperties();
    if (!props.length || props.length > MAX_FIELDS) return null;
    const fields = [];
    for (const prop of props) {
      const decl = prop.declarations?.find(ts.isPropertySignature);
      if (
        !decl?.type ||
        ts.isComputedPropertyName(decl.name) ||
        !isOwnedFile(decl.getSourceFile().fileName, distDir)
      )
        return null;
      fields.push({ prop, decl });
    }

    const nextSeen = new Set(seen).add(type);
    const pad = ' '.repeat(depth * 4);
    const inner = pad + '    ';
    const lines = ['{'];
    for (const { prop, decl } of fields) {
      const trivia = decl
        .getSourceFile()
        .text.slice(decl.getFullStart(), decl.getStart());
      const comment = trivia.match(/\/\*\*[\s\S]*?\*\//)?.[0];
      if (comment) {
        for (const line of comment.split('\n')) {
          const trimmed = line.trim();
          if (trimmed)
            lines.push(inner + (trimmed.startsWith('*') ? ' ' : '') + trimmed);
        }
      }

      // Use the instantiated property type. Copying decl.type's text leaks
      // generic parameters such as TData out of their original scope.
      const propType = checker.getTypeOfSymbolAtLocation(prop, context);
      const nested =
        depth < MAX_DEPTH
          ? renderObject(propType, context, depth + 1, nextSeen)
          : null;
      const typeText = nested ?? renderType(propType, context);
      if (!typeText) return null;

      const optional = prop.flags & ts.SymbolFlags.Optional ? '?' : '';
      const readonly = decl.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ReadonlyKeyword,
      )
        ? 'readonly '
        : '';
      lines.push(
        `${inner}${readonly}${decl.name.getText()}${optional}: ${typeText};`,
      );
    }
    lines.push(`${pad}}`);
    return lines.join('\n');
  }

  function renderType(type, context) {
    const node = checker.typeToTypeNode(
      type,
      context,
      ts.NodeBuilderFlags.NoTruncation |
        ts.NodeBuilderFlags.AllowNodeModulesRelativePaths,
    );
    if (!node) return null;
    let portable = true;
    const transformed = ts.transform(node, [
      (context) =>
        normalizeImports(context, () => {
          portable = false;
        }),
    ]);
    const text = portable
      ? printer.printNode(
          ts.EmitHint.Unspecified,
          transformed.transformed[0],
          source,
        )
      : null;
    transformed.dispose();
    return text;
  }

  function normalizeImports(context, unsupported) {
    function visit(node) {
      // Keep this private completion helper structural when moving its type.
      if (
        (ts.isTypeReferenceNode(node) &&
          ts.isIdentifier(node.typeName) &&
          node.typeName.text === 'LooseString') ||
        (ts.isImportTypeNode(node) && node.qualifier?.text === 'LooseString')
      ) {
        return ts.factory.createIntersectionTypeNode([
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          ts.factory.createTypeLiteralNode([]),
        ]);
      }
      if (
        ts.isImportTypeNode(node) &&
        ts.isLiteralTypeNode(node.argument) &&
        ts.isStringLiteral(node.argument.literal) &&
        path.isAbsolute(node.argument.literal.text)
      ) {
        const target = node.argument.literal.text;
        const pkg = packageName(target);
        let spec =
          pkg ??
          path.relative(path.dirname(file), target).split(path.sep).join('/');
        spec = spec.replace(/\.d\.ts$/, '');
        if (!pkg && !spec.startsWith('.')) spec = `./${spec}`;
        let qualifier = node.qualifier;
        if (pkg && qualifier) {
          const names = exportedPath(pkg, target, qualifier);
          if (!names) {
            unsupported();
            return node;
          }
          qualifier = names
            .map((name) => ts.factory.createIdentifier(name))
            .reduce((left, right) =>
              ts.factory.createQualifiedName(left, right),
            );
        }
        node = ts.factory.updateImportTypeNode(
          node,
          ts.factory.createLiteralTypeNode(
            ts.factory.createStringLiteral(spec),
          ),
          node.attributes,
          qualifier,
          node.typeArguments,
          node.isTypeOf,
        );
      }
      return ts.visitEachChild(node, visit, context);
    }
    return (node) => ts.visitNode(node, visit);
  }

  function exportedPath(pkg, target, qualifier) {
    const names = entityName(qualifier);
    const key = `${pkg}:${target}:${names}`;
    if (publicPaths.has(key)) return publicPaths.get(key);
    const targetSource = [
      target,
      `${target}.d.ts`,
      path.join(target, 'index.d.ts'),
    ]
      .map((file) => program.getSourceFile(file))
      .find(Boolean);
    const resolved = ts.resolveModuleName(
      pkg,
      file,
      compilerOptions,
      ts.sys,
    ).resolvedModule;
    const packageSource =
      resolved && program.getSourceFile(resolved.resolvedFileName);
    let symbol = targetSource && checker.getSymbolAtLocation(targetSource);
    for (const name of names.split('.')) {
      symbol =
        symbol &&
        checker.getExportsOfModule(symbol).find((item) => item.name === name);
      if (symbol?.flags & ts.SymbolFlags.Alias)
        symbol = checker.getAliasedSymbol(symbol);
    }
    const module = packageSource && checker.getSymbolAtLocation(packageSource);
    const result =
      symbol && module ? findExportPath(module, symbol, new Set()) : null;
    publicPaths.set(key, result);
    return result;
  }

  function findExportPath(module, target, seen) {
    if (seen.has(module)) return null;
    seen.add(module);
    const exports = checker.getExportsOfModule(module).map((symbol) => ({
      name: symbol.name,
      resolved:
        symbol.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(symbol)
          : symbol,
    }));
    const direct = exports.find((item) => item.resolved === target);
    if (direct) return [direct.name];
    for (const item of exports) {
      if (!(item.resolved.flags & ts.SymbolFlags.Module)) continue;
      const nested = findExportPath(item.resolved, target, seen);
      if (nested) return [item.name, ...nested];
    }
    return null;
  }
}

function entityName(node) {
  return ts.isIdentifier(node)
    ? node.text
    : `${entityName(node.left)}.${node.right.text}`;
}

// NodeNext requires explicit extensions, including imports inside .d.ts files.
function withRelativeExtensions(text, file) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const edits = [];
  function walk(node) {
    let literal;
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      literal = node.moduleSpecifier;
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument)
    ) {
      literal = node.argument.literal;
    }
    if (
      literal &&
      ts.isStringLiteral(literal) &&
      (literal.text.startsWith('./') || literal.text.startsWith('../')) &&
      !/\.(?:[cm]?js|json|css)$/.test(literal.text)
    ) {
      const resolved = ts.resolveModuleName(
        literal.text,
        file,
        compilerOptions,
        ts.sys,
      ).resolvedModule;
      const spec = literal.text.replace(/\.d\.ts$|\/$/, '');
      const suffix =
        resolved?.resolvedFileName.endsWith('/index.d.ts') &&
        !spec.endsWith('/index')
          ? '/index.js'
          : '.js';
      edits.push({
        start: literal.getStart(source),
        end: literal.getEnd(),
        text: JSON.stringify(spec + suffix),
      });
    }
    ts.forEachChild(node, walk);
  }
  walk(source);
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
  }
  return text;
}

function packageName(fileName) {
  const normalized = fileName.split(path.sep).join('/');
  if (!normalized.includes('/node_modules/')) return null;
  const parts = normalized.split('/node_modules/').at(-1).split('/');
  if (parts[0] === '@types') return parts[1];
  return parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
}

function isOwnedFile(fileName, distDir) {
  const normalized = path.resolve(fileName);
  if (normalized.startsWith(distDir + path.sep)) return true;
  return ['@bluxcc/core', '@bluxcc/react'].includes(packageName(normalized));
}

export function inlinePublicTypesPlugin(dir = 'dist') {
  return {
    name: 'inline-public-types',
    // Both Rollup outputs must finish emitting before declarations are changed.
    async closeBundle() {
      await inlinePublicTypes(dir);
    },
  };
}
