# Blux React

**Review date:** 26 September 2026  
**Package:** `@bluxcc/react` 0.3.7

`@bluxcc/react` is a thin host for `@bluxcc/core`. `BluxProvider` owns `createConfig`. Hooks subscribe to the same session and call the same Soroban helpers, using TanStack Query for reads and writes. The core package stays the source of truth for encoding, simulation, and signing.

## What holds up

- The package does not reimplement contract encoding or session storage. `useReadContract` calls `readContract`, `useReadContracts` calls `readContracts`, and `useWriteContract` calls `writeContract`.
- `useReadContract` is the single-call counterpart of `useReadContracts`: one `{ address, fn, args }` call, a decoded `data.value`, and the raw simulation on `data.raw`. Generics follow the core result, so `useReadContract<string>()` types `data.value` as `string`.
- Login hooks (`useLoginEmail`, `useLoginSms`, `useLoginOAuth`, `useLoginPasskey`, `useLoginWallet`) are headless wrappers. They return status and callbacks and leave the form to the host.
- `useBlux` re-renders when the user or auth flags change, so `login`, `logout`, and the signing methods stay aligned with the core store.
- `useJwt` / `getJwt` read the in-memory session token. The React package does not copy that token into `localStorage`. The dashboard uses `getJwt()` when it calls the Blux API.
- Query keys include the network and a stable serialization of the call, including `bigint`, XDR, `Map`, and byte values, so a new argument set refetches and an unchanged one does not.
- Stellar data hooks share one options shape (`cursor`, `limit`, `order`, `network`) and default the network to the active one.
- `peerDependencies` keep React, TanStack Query, the Stellar SDK, and `@bluxcc/core` on the host's copies, so the dashboard and the provider share one session store.

## Easy follow-ups

These are small and local. None of them change the session model.

1. **Import public types from `@bluxcc/core`, not from `dist`.** Most hooks import types from paths like `@bluxcc/core/dist/exports/utils` and `@bluxcc/core/dist/exports/core/getAccount`. Those paths match today's build output and break if the package layout changes. The same types are already exported from the package entry.

2. **Wire the type test into `package.json`.** `tests/contract-return-types.test.ts` checks that `useReadContract`, `useReadContracts`, and `useWriteContract` keep their generics. The scripts section only has `dev` and `build`, so that file does not run unless someone invokes `tsc` on it directly. A `typecheck` script would make the failure obvious.

3. **Put hook dependencies in the `useMemo` array directly.** `useReadContract` and `useReadContracts` copy dependencies into a `deps` array and then spread `[...deps]` into `useMemo`. The hooks lint rule cannot see `network` or the serialized call, so a new option is easy to forget. Inlining `[network, serializedCall]` is the whole fix.
