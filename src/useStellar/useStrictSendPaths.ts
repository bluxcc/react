import { useMemo } from 'react';
import { getStrictSendPaths } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetPaymentPathResult
} from "@bluxcc/core/dist/exports/core/getStrictSendPaths";

import { Asset } from '@stellar/stellar-sdk';
import { CallBuilderOptions, getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetPaymentPathResult;
type O = CallBuilderOptions;

/**
 * Finds payment paths for a fixed source amount (strict-send) via Horizon.
 *
 * Use this when you know exactly how much the sender will spend and want to
 * discover the paths and how much the destination would receive. For the
 * inverse — fixing the received amount — use `useStrictReceivePaths`.
 *
 * @param args - `[sourceAsset, sourceAmount, destination]`: the asset the sender
 *   spends, the exact amount they spend, and the destination (a `G…` address, or
 *   an array of candidate destination `Asset`s).
 * @param options - Optional `cursor` / `limit` / `order` and `network`
 *   (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`;
 *   `response.records` holds each candidate path with its destination amount.
 *
 * @example
 * ```tsx
 * const { data } = useStrictSendPaths([Asset.native(), '50', 'GA…']);
 * ```
 */
export function useStrictSendPaths(
  args: [
    sourceAsset: Asset,
    sourceAmount: string,
    destination: string | Asset[],
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
    () => ['blux', 'strictSendPaths', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getStrictSendPaths(args, opts);
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