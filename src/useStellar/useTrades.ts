import { useMemo } from 'react';
import { getTrades } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetTradesResult,
  GetTradesOptions,
} from "@bluxcc/core/dist/exports/core/getTrades";

import { getNetwork } from '../utils';
import type { QueryOptions } from "../utils";

type R = GetTradesResult;
type O = GetTradesOptions;

/**
 * Fetches a paginated list of executed trades from Horizon.
 *
 * Filter by `forAssetPair` (`[base, counter]`), `forAccount`, `forOffer`,
 * `forLiquidityPool`, or `forType` (e.g. orderbook vs. liquidity-pool trades).
 *
 * @param options - The `for…` filters, plus optional `cursor` / `limit` /
 *   `order` and `network` (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`;
 *   `response.records` holds the trade records (price, amounts, counterparties).
 *
 * @example
 * ```tsx
 * const { data } = useTrades({
 *   forAssetPair: [Asset.native(), new Asset('USDC', 'GA…')],
 * });
 * ```
 */
export function useTrades(
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forAssetPair,
    options?.forOffer,
    options?.forType,
    options?.forLiquidityPool,
    options?.forAccount,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'trades', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getTrades(opts);
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