import { useMemo } from 'react';
import { getClaimableBalances } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetClaimableBalancesResult,
  GetClaimableBalancesOptions,
} from "@bluxcc/core/dist/exports/core/getClaimableBalances";

import { getAddress, getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetClaimableBalancesResult;
type O = GetClaimableBalancesOptions;

/**
 * Fetches claimable balances addressed to a claimant from Horizon.
 *
 * `claimant` defaults to the connected wallet, so by default it lists balances
 * the current user can claim. `asset` is required; `sponsor` optionally filters
 * by who reserved the balance.
 *
 * @param options - Required: `asset` (the `Asset` to filter by) and `claimant`
 *   (defaults to the connected wallet). Optional: `sponsor`,
 *   `cursor` / `limit` / `order`, and `network` (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`;
 *   `response.records` holds the claimable balance records.
 *
 * @example
 * ```tsx
 * const { data } = useClaimableBalances({ asset: Asset.native() });
 * ```
 */
export function useClaimableBalances(
  options: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const claimant = getAddress(options.claimant);
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    claimant,
    options?.asset,
    options?.sponsor,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'claimableBalances', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        claimant,
        network,
      };

      return getClaimableBalances(opts);
    },
    [network, ...deps],
  );

  const result = useQuery<R, Error>({
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
    enabled,
    queryKey,
    queryFn,
  });

  return result;
}