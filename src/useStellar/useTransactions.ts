import { useMemo } from "react";
import { getTransactions } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetTransactionsResult,
  GetTransactionsOptions,
} from "@bluxcc/core/dist/exports/core/getTransactions";

import { getNetwork } from "../utils";
import type { QueryOptions } from "../utils";

type R = GetTransactionsResult;
type O = GetTransactionsOptions;

/**
 * Fetches a paginated list of transactions from Horizon.
 *
 * Filter by `forAccount`, `forLedger`, `forClaimableBalance`, or
 * `forLiquidityPool`; set `includeFailed` to include transactions that failed.
 *
 * @param options - The `for…` filters and `includeFailed`, plus optional
 *   `cursor` / `limit` / `order` and `network` (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`;
 *   `response.records` holds the transaction records.
 *
 * @example
 * ```tsx
 * const { data } = useTransactions({ forAccount: 'GA…', limit: 25 });
 * ```
 */
export function useTransactions(
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
    options?.forLiquidityPool,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ["blux", "transactions", network, ...deps],
    [network, ...deps]
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };
      return getTransactions(opts);
    },
    [network, ...deps]
  );

  const result = useQuery<R, Error>({
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
    enabled,
    queryKey,
    queryFn,
});

  return result;
}
