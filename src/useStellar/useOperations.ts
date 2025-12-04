import { useMemo } from 'react';
import { getOperations } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetOperationsResult,
  GetOperationsOptions,
} from "@bluxcc/core/dist/exports/core/getOperations";

import { getNetwork } from '../utils';

type R = GetOperationsResult;
type O = GetOperationsOptions;

export function useOperations(
  options?: O,
  queryOptions?: UseQueryOptions<R, Error>,
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forAccount,
    options?.forClaimableBalance,
    options?.forLedger,
    options?.forTransaction,
    options?.forLiquidityPool,
    options?.includeFailed,
    options?.forAccount,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'operations', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getOperations(opts);
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