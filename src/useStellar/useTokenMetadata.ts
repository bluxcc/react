import { useMemo } from 'react';
import { getTokenMetadata } from '@bluxcc/core';
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  TokenMetadata,
  GetTokenMetadataOptions,
} from '@bluxcc/core/dist/exports/core/getTokenMetadata';

import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = TokenMetadata;
type O = GetTokenMetadataOptions;

/**
 * Reads a SEP-41 token / Stellar Asset Contract's metadata by wrapping the core
 * `getTokenMetadata` in a TanStack query.
 *
 * The read is simulation-only — no account, signing, or fees — so it works for
 * any contract id, deployed or not yet funded. `decimals`, `name`, and `symbol`
 * come from the standard token interface; `owner` is read separately and is
 * `undefined` for contracts without an `owner()` function (notably Stellar Asset
 * Contracts, which expose `admin()` instead). The query stays disabled until a
 * non-empty `address` is provided.
 *
 * @param address - The token contract id (`C…`), e.g. a SAC from
 *   {@link useSacAddress} / `getSacAddress`.
 * @param options - Core read options (currently just `network`, which defaults
 *   to the active network).
 * @param queryOptions - Optional TanStack Query options (`enabled`, `staleTime`,
 *   `select`, …); `queryKey` and `queryFn` are provided by the hook.
 * @returns A TanStack query result. Read `data` (the {@link TokenMetadata}),
 *   `isLoading`, `isError`, `error`, `refetch`, etc.
 *
 * @example
 * ```tsx
 * // Read a token contract directly.
 * const { data, isLoading, error } = useTokenMetadata('C…');
 * // data → { decimals: 7, name: 'USD Coin', symbol: 'USDC', owner?: 'G…' }
 *
 * // Derive a classic asset's SAC, then read its metadata once it's known.
 * const { data: sac } = useSacAddress('USDC:GA…');
 * const { data: meta } = useTokenMetadata(sac ?? '', undefined, {
 *   enabled: Boolean(sac),
 * });
 * ```
 */
export function useTokenMetadata(
  address: string,
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = (queryOptions?.enabled ?? true) && Boolean(address);

  const deps = [
    address,
    network,
  ];

  const queryKey = useMemo(
    () => ['blux', 'tokenMetadata', ...deps],
    [...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getTokenMetadata(address, opts);
    },
    [...deps],
  );

  const result = useQuery<R, Error>({
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
    enabled,
    queryKey,
    queryFn,
  });

  return result;
}
