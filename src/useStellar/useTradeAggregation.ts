import { useMemo } from 'react';
import { getTradeAggregation } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetTradeAggregationResult
} from "@bluxcc/core/dist/exports/core/getTradeAggregation";

import { Asset } from '@stellar/stellar-sdk';
import { CallBuilderOptions, getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetTradeAggregationResult;
type O = CallBuilderOptions;

/**
 * Fetches aggregated trade history (OHLC-style time buckets) for an asset pair
 * from Horizon.
 *
 * Useful for building price charts: trades between `base` and `counter` are
 * grouped into fixed `resolution`-millisecond buckets over the
 * `start_time`–`end_time` window.
 *
 * @param args - `[base, counter, start_time, end_time, resolution, offset]`: the
 *   two assets, the start/end of the window (ms since epoch), the bucket size
 *   `resolution` (ms), and a timezone `offset` (ms).
 * @param options - Optional `cursor` / `limit` / `order` and `network`
 *   (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result whose `data` holds the aggregated trade
 *   records (open/high/low/close and volume) per time bucket.
 *
 * @example
 * ```tsx
 * const { data } = useTradeAggregation([
 *   Asset.native(), new Asset('USDC', 'GA…'), start, end, 3_600_000, 0,
 * ]);
 * ```
 */
export function useTradeAggregation(
  args: [
    base: Asset,
    counter: Asset,
    start_time: number,
    end_time: number,
    resolution: number,
    offset: number,
  ],
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    args[0],
    args[1],
    args[2],
    args[3],
    args[4],
    args[5],
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'tradeAggregation', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getTradeAggregation(args, opts);
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