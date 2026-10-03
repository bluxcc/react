import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import ts from 'typescript';

const project = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(
  await readFile(path.join(project, 'package.json'), 'utf8'),
);

test('packed declarations compile for consumers and retain editor hints', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'blux-packed-types-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const modules = path.join(root, 'node_modules');
  await mkdir(modules);
  const packageDir = path.join(modules, pkg.name);
  await mkdir(packageDir, { recursive: true });
  const packed = JSON.parse(
    execFileSync(
      'npm',
      ['pack', '--ignore-scripts', '--json', '--pack-destination', root],
      { cwd: project, encoding: 'utf8' },
    ),
  )[0];
  execFileSync('tar', [
    '-xzf',
    path.join(root, packed.filename),
    '-C',
    packageDir,
    '--strip-components=1',
  ]);
  const dependencies = path.join(project, 'node_modules');
  for (const entry of await readdir(dependencies, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (entry.name.startsWith('@')) {
      await mkdir(path.join(modules, entry.name), { recursive: true });
      for (const child of await readdir(path.join(dependencies, entry.name))) {
        if (`${entry.name}/${child}` === pkg.name) continue;
        await symlink(
          path.join(dependencies, entry.name, child),
          path.join(modules, entry.name, child),
        );
      }
    } else {
      await symlink(
        path.join(dependencies, entry.name),
        path.join(modules, entry.name),
      );
    }
  }
  await writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({ type: 'module' }),
  );
  const file = path.join(root, 'app.tsx');
  const contractTypes = (
    await readFile(
      path.join(project, 'tests/contract-return-types.test.ts'),
      'utf8',
    )
  ).replace("from '../dist'", `from '${pkg.name}'`);
  const react = pkg.name === '@bluxcc/react';
  let source = react
    ? `
import { BluxProvider, useLoginOAuth, useLoginEmail, useLoginSms,
  useLoginPasskey, useLoginWallet } from '@bluxcc/react';
import type { IUser } from '@bluxcc/core';
const provider = <BluxProvider config={{ appId: 'demo' }}>Hello</BluxProvider>;
// @ts-expect-error appId is required
const invalid = <BluxProvider config={{}}>Hello</BluxProvider>;
`
    : `
import { createConfig, type IConfig } from '@bluxcc/core';
const config: IConfig = { appId: 'demo' };
createConfig({ appId: 'demo' });
// @ts-expect-error appId is required
createConfig({});
`;
  source += '\n' + contractTypes;
  if (react) {
    for (const hook of [
      'useLoginOAuth',
      'useLoginEmail',
      'useLoginSms',
      'useLoginPasskey',
      'useLoginWallet',
    ]) {
      source += `
type ${hook}Options = NonNullable<Parameters<typeof ${hook}>[0]>;
type ${hook}User = Parameters<NonNullable<${hook}Options['onSuccess']>>[0];
type ${hook}Callback = Expect<Equal<${hook}User, IUser>>;
type ${hook}Data = Expect<Equal<ReturnType<typeof ${hook}>['data'], IUser | undefined>>;
`;
    }
  }
  await writeFile(file, source);

  const base = {
    noEmit: true,
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
  };
  for (const [module, moduleResolution] of [
    [ts.ModuleKind.ESNext, ts.ModuleResolutionKind.Bundler],
    [ts.ModuleKind.ESNext, ts.ModuleResolutionKind.Node10],
    [ts.ModuleKind.NodeNext, ts.ModuleResolutionKind.NodeNext],
  ]) {
    const program = ts.createProgram([file], {
      ...base,
      module,
      moduleResolution,
    });
    assert.deepEqual(
      ts
        .getPreEmitDiagnostics(program)
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')),
      [],
    );
  }

  const service = ts.createLanguageService({
    getCompilationSettings: () => ({
      ...base,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
    }),
    getScriptFileNames: () => [file],
    getScriptVersion: () => '1',
    getScriptSnapshot: (name) =>
      ts.sys.fileExists(name)
        ? ts.ScriptSnapshot.fromString(ts.sys.readFile(name))
        : undefined,
    getCurrentDirectory: () => root,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  });
  t.after(() => service.dispose());
  const position = react
    ? source.indexOf('<BluxProvider') + 1
    : source.indexOf('createConfig({');
  const hover = ts.displayPartsToString(
    service.getQuickInfoAtPosition(file, position)?.displayParts,
  );
  assert.match(hover, /appId: string/, 'hover lists config fields');
  assert.match(
    hover,
    /appName\?: string/,
    'hover lists optional config fields',
  );
  const marker = react ? 'config={{ ' : 'createConfig({ ';
  const completionPos = source.indexOf(marker) + marker.length;
  const completions = service.getCompletionsAtPosition(file, completionPos, {});
  const appId = completions?.entries.find((entry) => entry.name === 'appId');
  assert.ok(appId, 'config autocomplete offers appId');
  const details = service.getCompletionEntryDetails(
    file,
    completionPos,
    'appId',
    {},
    appId.source,
    undefined,
    appId.data,
  );
  assert.match(
    ts.displayPartsToString(details?.documentation),
    /Your Blux app id/,
  );
});
