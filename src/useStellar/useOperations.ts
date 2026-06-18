import { useMemo } from 'react';
import { getOperations } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetOperationsResult,
  GetOperationsOptions,
} from "@bluxcc/core/dist/exports/core/getOperations";

import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetOperationsResult;
type O = GetOperationsOptions;

/**
 * Fetches a paginated list of operations from Horizon.
 *
 * Operations are the individual actions inside transactions (payments, trades,
 * trustline changes, contract invocations, …). Filter by `forAccount`,
 * `forTransaction`, `forLedger`, `forClaimableBalance`, or `forLiquidityPool`;
 * set `includeFailed` to also include operations from failed transactions.
 *
 * @param options - The `for…` filters and `includeFailed`, plus optional
 *   `cursor` / `limit` / `order` and `network` (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`;
 *   `response.records` holds the operation records.
 *
 * @example
 * ```tsx
 * const { data } = useOperations({ forAccount: 'GA…', includeFailed: false });
 * ```
 */
export function useOperations(
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forAccount,
    options?.includeFailed,
    options?.forClaimableBalance,
    options?.forLedger,
    options?.forTransaction,
    options?.forLiquidityPool,
    options?.forAccount,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'operations', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getOperations(opts);
    },
    [network, options, ...deps],
  );

  const result = useQuery<R, Error>({
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
    enabled,
    queryKey,
    queryFn,
  });

  return result;
}