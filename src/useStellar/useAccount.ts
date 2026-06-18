import { useMemo } from 'react';
import { getAccount } from '@bluxcc/core';
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetAccountResult,
  GetAccountOptions,
} from '@bluxcc/core/dist/exports/core/getAccount';

import { getAddress, getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetAccountResult;
type O = GetAccountOptions;

/**
 * Fetches a single account's on-chain state from Horizon.
 *
 * Wraps the core `getAccount` call in a TanStack Query. When `address` is
 * omitted it falls back to the connected wallet's address, so it doubles as a
 * "current account" hook. Resolves to `null` when the account does not exist on
 * the target network (e.g. it has never been funded).
 *
 * @param options - `address` (the `G…` account to load; defaults to the
 *   connected wallet) and `network` (defaults to the active network).
 * @param queryOptions - Optional TanStack Query options (`enabled`, `staleTime`,
 *   `refetchInterval`, `select`, …). `queryKey`/`queryFn` are managed by the hook.
 * @returns A TanStack Query result; `data` is the Horizon `AccountResponse`, or
 *   `null` if the account is not found.
 *
 * @example
 * ```tsx
 * // Connected wallet's account
 * const { data: account, isLoading } = useAccount();
 *
 * // A specific account
 * const { data } = useAccount({ address: 'GA…' });
 * console.log(data?.sequence, data?.balances);
 * ```
 */
export function useAccount(
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const address = getAddress(options?.address);
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    address,
    network,
  ];

  const queryKey = useMemo(
    () => ['blux', 'account', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        address,
        network,
      };

      return getAccount(opts);
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