import { useMemo } from 'react';
import { getTransactions } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetTransactionsResult,
  GetTransactionsOptions,
} from "@bluxcc/core/dist/exports/core/getTransactions";

import { getNetwork } from '../utils';

type R = GetTransactionsResult;
type O = GetTransactionsOptions;

export function useTransactions(
  options?: O,
  queryOptions?: UseQueryOptions<R, Error>,
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forAccount,
    options?.forClaimableBalance,
    options?.forLedger,
    options?.forLiquidityPool,
    options?.includeFailed,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'transactions', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getTransactions(opts);
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