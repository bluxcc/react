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

import { getAddress, getNetwork } from '../utils';
import type { WithoutQueryInternals } from '../utils';

type R = GetAccountResult;
type O = GetAccountOptions;

export function useAccount(
  options?: O,
  queryOptions?: WithoutQueryInternals<R>
): UseQueryResult<R, Error> {
  const address = getAddress(options?.address);
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    address,
    network,
  ];

  const queryKey = useMemo(
    () => ['blux', 'account', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        address,
        network,
      };

      return getAccount(opts);
    },
    [network, ...deps],
  );

  const result = useQuery<R, Error>({
    queryKey,
    queryFn,
    enabled,
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
  });

  return result;
}