import { useMemo } from 'react';
import { getEffects } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetEffectsResult,
  GetEffectsOptions,
} from "@bluxcc/core/dist/exports/core/getEffects";

import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetEffectsResult;
type O = GetEffectsOptions;

export function useEffects(
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forAccount,
    options?.forLedger,
    options?.forTransaction,
    options?.forOperation,
    options?.forLiquidityPool,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'effects', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getEffects(opts);
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