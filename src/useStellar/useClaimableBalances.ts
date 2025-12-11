import { useMemo } from 'react';
import { getClaimableBalances } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetClaimableBalancesResult,
  GetClaimableBalancesOptions,
} from "@bluxcc/core/dist/exports/core/getClaimableBalances";

import { getAddress, getNetwork } from '../utils';
import type { WithoutQueryInternals } from '../utils';

type R = GetClaimableBalancesResult;
type O = GetClaimableBalancesOptions;

export function useClaimableBalances(
  options: O,
  queryOptions?: WithoutQueryInternals<R>
): UseQueryResult<R, Error> {
  const claimant = getAddress(options.claimant);
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    claimant,
    options?.asset,
    options?.sponsor,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'claimableBalances', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        claimant,
        network,
      };

      return getClaimableBalances(opts);
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