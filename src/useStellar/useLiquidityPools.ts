import { useMemo } from 'react';
import { getLiquidityPools } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetLiquidityPoolsResult,
  GetLiquidityPoolsOptions,
} from "@bluxcc/core/dist/exports/core/getLiquidityPools";

import { getNetwork } from '../utils';

type R = GetLiquidityPoolsResult;
type O = GetLiquidityPoolsOptions;

export function useLiquidityPools(
  options?: O,
  queryOptions?: UseQueryOptions<R, Error>,
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forAssets,
    options?.forAccount,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'liquidityPools', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getLiquidityPools(opts);
    },
    [network, options, ...deps],
  );

  const result = useQuery<R, Error>({
    queryKey,
    queryFn,
    enabled,
    ...queryOptions,
  });

  return result;
}