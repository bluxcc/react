import { useMemo } from 'react';
import { getAccounts } from '@bluxcc/core';
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetAccountsResult,
  GetAccountsOptions,
} from '@bluxcc/core/dist/exports/core/getAccounts';

import { getNetwork } from '../utils';
import type { WithoutQueryInternals } from '../utils';

type R = GetAccountsResult;
type O = GetAccountsOptions;

export function useAccounts(
  options?: O,
  queryOptions?: WithoutQueryInternals<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forSigner,
    options?.forAsset,
    options?.sponsor,
    options?.forLiquidityPool,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'accounts', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };
      
      return getAccounts(opts);
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