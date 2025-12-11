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

import { getAddress, getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetBalancesResult;
type O = GetBalancesOptions;

export function useBalances(
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const address = getAddress(options?.address);
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;
  const includeZeroBalances = options?.includeZeroBalances ?? true

  const deps = [
    address,
    network,
    includeZeroBalances,
  ];

  const queryKey = useMemo(
    () => ['blux', 'balances', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        address,
        includeZeroBalances,
        network,
      };

      return getBalances(opts);
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