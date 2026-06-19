import { useMemo } from 'react';
import { getSacAddress } from '@bluxcc/core';
import type { AssetArg } from '@bluxcc/core/dist/exports/core/helpers';

import { getNetwork } from '../utils';

/**
 * Result of {@link useSacAddress}. Because the underlying derivation is
 * synchronous and local, there is no loading state — `data` is populated
 * immediately, or `error` is set when the asset/network is invalid.
 */
export type UseSacAddressResult = {
  /** The Stellar Asset Contract id (`C…`), or `undefined` when it can't be derived. */
  data: string | undefined;
  /** The error thrown while deriving, or `null` on success. */
  error: Error | null;
};

/**
 * Computes the Stellar Asset Contract (SAC) id of a classic asset, memoized.
 *
 * Every classic asset — native XLM or a `CODE:ISSUER` pair — has a deterministic
 * Soroban contract id derived from the asset plus the network passphrase. The id
 * is computed locally with no network call (and regardless of whether the SAC is
 * actually deployed), so this hook is synchronous: it returns the value right
 * away rather than a TanStack query result. Feed the result into
 * {@link useTokenMetadata}, `transfer`'s `token` option, or
 * `useReadContracts` / `useWriteContract`.
 *
 * Errors are captured rather than thrown during render: an invalid asset or a
 * missing network passphrase surfaces as `{ data: undefined, error }`.
 *
 * @param asset - The asset: `'xlm'` / `'native'`, a `CODE:ISSUER` string, or an
 *   `Asset`. Pass a stable value (a string, or a memoized `Asset`) to avoid
 *   recomputing every render.
 * @param network - Network passphrase to derive against. Defaults to the active
 *   network.
 * @returns `{ data, error }` — see {@link UseSacAddressResult}.
 *
 * @example
 * ```tsx
 * const { data: sac, error } = useSacAddress('USDC:GA…');
 * // sac → 'C…'
 *
 * // Chain into a metadata read once the SAC is known.
 * const { data: meta } = useTokenMetadata(sac ?? '', undefined, {
 *   enabled: Boolean(sac),
 * });
 * ```
 */
export function useSacAddress(
  asset: AssetArg,
  network?: string,
): UseSacAddressResult {
  const resolvedNetwork = getNetwork(network);

  return useMemo(() => {
    try {
      return { data: getSacAddress(asset, resolvedNetwork), error: null };
    } catch (error) {
      return { data: undefined, error: error as Error };
    }
  }, [asset, resolvedNetwork]);
}
