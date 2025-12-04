import { useMemo } from 'react';
import { getAccount } from '@bluxcc/core';
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetAccountResult,
  GetAccountOptions,
} from '@bluxcc/core/dist/exports/core/getAccount';

import { getNetwork } from '../utils';

type R = GetAccountResult;
type O = GetAccountOptions;

export function useAccount(
  options?: O,
  queryOptions?: UseQueryOptions<R, Error>,
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.address,
    options?.network,
  ];

  const queryKey = useMemo(
    () => ['blux', 'account', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getAccount(opts);
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