import { useMemo } from 'react';
import { getAccounts } from '@bluxcc/core';
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetAccountsResult,
  GetAccountsOptions,
} from '@bluxcc/core/dist/exports/core/getAccounts';

import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetAccountsResult;
type O = GetAccountsOptions;

/**
 * Fetches a paginated list of accounts that match a filter from Horizon.
 *
 * Exactly one filter is required: `forSigner` (accounts a key can sign for),
 * `forAsset` (accounts that hold a trustline to an asset), `sponsor` (accounts
 * sponsored by an address), or `forLiquidityPool` (accounts holding pool
 * shares). Standard pagination (`cursor`, `limit`, `order`) applies.
 *
 * @param options - One of the required filters above, plus optional
 *   `cursor` / `limit` / `order` and `network` (defaults to the active network).
 * @param queryOptions - Optional TanStack Query options (`enabled`, `staleTime`,
 *   …). `queryKey`/`queryFn` are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`, where
 *   `response` is the Horizon collection page (`response.records`, plus
 *   `response.next()` / `response.prev()` for pagination) and `builder` is the
 *   underlying call builder for advanced queries or streaming.
 *
 * @example
 * ```tsx
 * const { data } = useAccounts({ forSigner: 'GA…', limit: 20 });
 * data?.response.records.forEach((a) => console.log(a.account_id));
 * ```
 */
export function useAccounts(
  options?: O,
  queryOptions?: QueryOptions<R>,
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forSigner,
    options?.forAsset,
    options?.sponsor,
    options?.forLiquidityPool,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'accounts', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      // @ts-ignore
      const opts: O = {
        ...options,
        network,
      };

      return getAccounts(opts);
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
