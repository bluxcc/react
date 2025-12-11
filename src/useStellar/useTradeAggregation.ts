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
import type { WithoutQueryInternals } from '../utils';

type R = GetTradeAggregationResult;
type O = CallBuilderOptions;

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
  queryOptions?: WithoutQueryInternals<R>
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
    queryKey,
    queryFn,
    enabled,
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
  });

  return result;
}