import { useMemo } from 'react';
import { getOrderbook } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetOrderbookResult
} from "@bluxcc/core/dist/exports/core/getOrderbook";

import { Asset } from '@stellar/stellar-sdk';
import { CallBuilderOptions, getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetOrderbookResult;
type O = CallBuilderOptions;

/**
 * Fetches the current DEX order book for a `selling`/`buying` asset pair from
 * Horizon.
 *
 * @param args - `[selling, buying]` — the two `Asset`s whose order book to load
 *   (e.g. `[Asset.native(), usdc]`).
 * @param options - Optional `cursor` / `limit` / `order` and `network`
 *   (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`, where
 *   `response` holds the `bids` and `asks` arrays.
 *
 * @example
 * ```tsx
 * const { data } = useOrderbook([Asset.native(), new Asset('USDC', 'GA…')]);
 * console.log(data?.response.bids, data?.response.asks);
 * ```
 */
export function useOrderbook(
  args: [selling: Asset, buying: Asset],
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    args[0],
    args[1],
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'orderbook', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getOrderbook(args, opts);
    },
    [network, options, ...deps],
  );

  return useQuery<R, Error>({
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
    enabled,
    queryKey,
    queryFn,
  });
}
