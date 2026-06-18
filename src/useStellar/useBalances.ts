import { useMemo } from 'react';
import { getBalances } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetBalancesResult,
  GetBalancesOptions,
} from "@bluxcc/core/dist/exports/core/getBalances";

import { getAddress, getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetBalancesResult;
type O = GetBalancesOptions;

/**
 * Fetches an account's asset balances from Horizon.
 *
 * When `address` is omitted it uses the connected wallet. By default zero
 * balances (e.g. empty trustlines) are included; set `includeZeroBalances` to
 * `false` to drop them. Pairs well with `useTransfer`'s `onSuccess` to refetch
 * balances after a payment.
 *
 * @param options - `address` (defaults to the connected wallet),
 *   `includeZeroBalances` (default `true`), and `network` (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result; `data` is an array of Horizon balance lines
 *   (the native balance plus each trustline).
 *
 * @example
 * ```tsx
 * const { data: balances } = useBalances();
 * const xlm = balances?.find((b) => b.asset_type === 'native');
 * ```
 */
export function useBalances(
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const address = getAddress(options?.address);
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;
  const includeZeroBalances = options?.includeZeroBalances ?? true

  const deps = [
    address,
    network,
    includeZeroBalances,
  ];

  const queryKey = useMemo(
    () => ['blux', 'balances', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        address,
        includeZeroBalances,
        network,
      };

      return getBalances(opts);
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