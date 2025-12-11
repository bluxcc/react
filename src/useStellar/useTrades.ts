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
import type { WithoutQueryInternals } from "../utils";

type R = GetTradesResult;
type O = GetTradesOptions;

export function useTrades(
  options?: O,
  queryOptions?: WithoutQueryInternals<R>
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
    queryKey,
    queryFn,
    enabled,
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
  });

  return result;
}