import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';
import {
  inlinePublicTypes,
  validatePublicTypes,
} from '../rollup-inline-public-types.mjs';

async function fixture(t, files) {
  const root = await mkdtemp(path.join(tmpdir(), 'blux-declarations-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dist = path.join(root, 'dist');
  await mkdir(dist);
  for (const [name, text] of Object.entries(files)) {
    const file = path.join(dist, name);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, text);
  }
  return {
    root,
    dist,
    read: (file = 'index.d.ts') => readFile(path.join(dist, file), 'utf8'),
  };
}

function assertCompiles(file) {
  const program = ts.createProgram([file], {
    noEmit: true,
    strict: true,
    exactOptionalPropertyTypes: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2020,
    types: [],
  });
  assert.deepEqual(
    ts
      .getPreEmitDiagnostics(program)
      .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')),
    [],
  );
}

test('OAuth intersections and generic callbacks remain valid after repeated rewrites', async (t) => {
  const f = await fixture(t, {
    'model.d.ts': `
export interface User { email: string; }
export type Status = 'idle' | 'pending';
export type Options<TData> = {
  /** Called with the authenticated user. */
  onSuccess?: (data: TData) => void;
  onSettled?: (data: TData | undefined, error: Error | null) => void;
};
export type State<TData> = { data: TData | undefined; status: Status; };
export interface OAuthOptions { telegramUser?: Record<string, unknown>; }
`,
    'index.d.ts': `
import type { Options, State, User, OAuthOptions } from './model';
type Status = 'unrelated';
export type LoginOptions = Options<User>;
export type LoginResult = State<User> & {
  loginOAuth: (provider: string, options?: OAuthOptions) => void;
  loginOAuthAsync: (provider: string, options?: OAuthOptions) => Promise<User>;
  reset: () => void;
};
export declare function useLogin(options?: LoginOptions): LoginResult;
export declare function generic<TData>(options: Options<TData>): State<TData>;
`,
  });
  await inlinePublicTypes(f.dist);
  const first = await f.read();
  await inlinePublicTypes(f.dist);
  assert.equal(await f.read(), first, 'rewriting must be idempotent');
  assert.match(first, /onSuccess\?: \(data: User\) => void/);
  assert.match(first, /Called with the authenticated user/);
  assert.doesNotMatch(first, /import.*TData/);
  assert.doesNotMatch(first, /import\(["'][\/]/);
  await writeFile(
    path.join(f.root, 'app.ts'),
    `
import type { LoginOptions, LoginResult } from './dist';
import type { User, State } from './dist/model';
import { generic } from './dist';
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;
type Callback = Expect<Equal<Parameters<NonNullable<LoginOptions['onSuccess']>>[0], User>>;
type Data = Expect<Equal<LoginResult['data'], User | undefined>>;
type Status = Expect<Equal<LoginResult['status'], 'idle' | 'pending'>>;
const result = generic<number>({ onSuccess: value => value.toFixed() });
type Generic = Expect<Equal<typeof result, State<number>>>;
`,
  );
  assertCompiles(path.join(f.root, 'app.ts'));
});

test('readonly, explicit undefined, namespaces and index signatures keep their meaning', async (t) => {
  const f = await fixture(t, {
    'model.d.ts': `
export declare namespace Network { interface Options { chain: string; } }
export interface Config {
  readonly appId: string;
  appName?: string;
  explicit?: string | undefined;
  network: Network.Options;
}
export interface Dictionary { default: string; [key: string]: string; }
`,
    'index.d.ts': `
import type { Config, Dictionary } from './model';
export declare function createConfig(config: Config): void;
export declare function dictionary(config: Dictionary): void;
export type ConfigAlias = Config;
export type DictionaryAlias = Dictionary;
`,
  });
  await inlinePublicTypes(f.dist);
  const text = await f.read();
  assert.match(text, /readonly appId: string/);
  assert.match(text, /appName\?: string;/);
  assert.match(text, /explicit\?: string \| undefined;/);
  assert.match(text, /dictionary\(config: Dictionary\)/);
  assert.match(text, /DictionaryAlias = Dictionary/);
  await writeFile(
    path.join(f.root, 'app.ts'),
    `
import { createConfig, dictionary, type ConfigAlias } from './dist';
createConfig({ appId: 'x', explicit: undefined, network: { chain: 'testnet' } });
// @ts-expect-error appName does not explicitly accept undefined
createConfig({ appId: 'x', appName: undefined, network: { chain: 'testnet' } });
declare const config: ConfigAlias;
// @ts-expect-error appId remains readonly
config.appId = 'other';
dictionary({ default: 'x', arbitrary: 'y' });
// @ts-expect-error index signature values remain strings
dictionary({ default: 'x', arbitrary: 1 });
`,
  );
  assertCompiles(path.join(f.root, 'app.ts'));
});

test('peer types use portable package imports and built-in Window remains global', async (t) => {
  const f = await fixture(t, {
    'index.d.ts': `
import type { IConfig } from '@bluxcc/core';
export declare function provider(props: { config: IConfig }): void;
export declare function callback(options: IConfig): void;
`,
  });
  const peer = path.join(f.root, 'node_modules/@bluxcc/core');
  await mkdir(peer, { recursive: true });
  await writeFile(
    path.join(peer, 'package.json'),
    JSON.stringify({
      name: '@bluxcc/core',
      types: 'index.d.ts',
      exports: { '.': { types: './index.d.ts' } },
    }),
  );
  await writeFile(
    path.join(peer, 'index.d.ts'),
    `
export interface IConfig { appId: string; callback?: (window: Window) => void; nested: Metadata | null; }
export interface Metadata { code: string; }
`,
  );
  await inlinePublicTypes(f.dist);
  const text = await f.read();
  assert.match(text, /appId: string/);
  assert.match(text, /window: Window/);
  assert.match(text, /import\("@bluxcc\/core"\)\.Metadata/);
  assert.doesNotMatch(text, /import\("typescript"\)/);
  assert.doesNotMatch(text, new RegExp(f.root));
  assertCompiles(path.join(f.dist, 'index.d.ts'));
});

test('invalid declarations fail validation without writing any rewritten files', async (t) => {
  const f = await fixture(t, {
    'index.d.ts': `export interface Config { appId: string; }
export declare function createConfig(config: Config): void;
`,
    'broken.d.ts': 'export type Broken = MissingType;',
  });
  const before = await f.read();
  await assert.rejects(
    inlinePublicTypes(f.dist),
    /Invalid published TypeScript declarations/,
  );
  assert.equal(await f.read(), before);
  await assert.rejects(validatePublicTypes(f.dist), /MissingType/);
  await writeFile(path.join(f.dist, 'broken.d.ts'), 'export type Broken = ;');
  await assert.rejects(
    inlinePublicTypes(f.dist),
    /Invalid published TypeScript declarations/,
  );
  assert.equal(await f.read(), before);
});
