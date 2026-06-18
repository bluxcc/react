import { useMemo } from 'react';
import { getStrictReceivePaths } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetPaymentPathResult
} from "@bluxcc/core/dist/exports/core/getStrictReceivePaths";

import { Asset } from '@stellar/stellar-sdk';
import { CallBuilderOptions, getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetPaymentPathResult;
type O = CallBuilderOptions;

/**
 * Finds payment paths for a fixed destination amount (strict-receive) via
 * Horizon.
 *
 * Use this when you know exactly how much the recipient should receive and want
 * to discover which source assets/paths can deliver it (and what they would
 * cost). For the inverse — fixing what the sender spends — use
 * `useStrictSendPaths`.
 *
 * @param args - `[source, destinationAsset, destinationAmount]`: the source
 *   (a sending `G…` address, or an array of candidate source `Asset`s), the
 *   asset the destination receives, and the exact amount they receive.
 * @param options - Optional `cursor` / `limit` / `order` and `network`
 *   (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`;
 *   `response.records` holds each candidate path with its source amount.
 *
 * @example
 * ```tsx
 * const { data } = useStrictReceivePaths(['GA…', new Asset('USDC', 'GA…'), '100']);
 * ```
 */
export function useStrictReceivePaths(
  args: [
    source: string | Asset[],
    destinationAsset: Asset,
    destinationAmount: string,
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
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'strictReceivePaths', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getStrictReceivePaths(args, opts);
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