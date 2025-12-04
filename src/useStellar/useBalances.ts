import { useMemo } from 'react';
import { getBalances } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetBalancesResult,
  GetBalancesOptions,
} from "@bluxcc/core/dist/exports/core/getBalances";

import { getNetwork } from '../utils';

type R = GetBalancesResult;
type O = GetBalancesOptions;

export function useBalances(
  options?: O,
  queryOptions?: UseQueryOptions<R, Error>,
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.address,
    options?.network,
    options?.includeZeroBalances
  ];

  const queryKey = useMemo(
    () => ['blux', 'balances', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getBalances(opts);
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