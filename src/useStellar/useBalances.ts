import { useMemo } from 'react';
import { getBalances } from '@bluxcc/core';
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetBalancesResult,
  GetBalancesOptions,
} from '@bluxcc/core/dist/exports/core/getBalances';

import { getAddress, getNetwork } from '../utils';

type R = GetBalancesResult;
type O = GetBalancesOptions;

export function useBalances(
  options?: O,
  queryOptions?: UseQueryOptions<R, Error>,
): UseQueryResult<R, Error> {
  const address = getAddress(options?.address);
  const network = getNetwork(options?.network);
  const enabled = !!address && (queryOptions?.enabled ?? true);
  const includeZeroBalances = options?.includeZeroBalances ?? true;

  const queryKey = useMemo(
    () => ['blux', 'balances', address, network, includeZeroBalances],
    [address, network, includeZeroBalances],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        address,
        network,
        includeZeroBalances,
      };

      return getBalances(opts);
    },
    [address, network, includeZeroBalances],
  );

  const result = useQuery<R, Error>({
    queryKey,
    queryFn,
    enabled,
    ...queryOptions,
  });

  return result;
}
