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
import type { WithoutQueryInternals } from '../utils';

type R = GetOperationsResult;
type O = GetOperationsOptions;

export function useOperations(
  options?: O,
  queryOptions?: WithoutQueryInternals<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forAccount,
    options?.includeFailed,
    options?.forClaimableBalance,
    options?.forLedger,
    options?.forTransaction,
    options?.forLiquidityPool,
    options?.forAccount,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'operations', network, ...deps],
    [network, ...deps],
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
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
  });

  return result;
}