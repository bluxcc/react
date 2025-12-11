import { useMemo } from 'react';
import { getOffers } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetOffersResult,
  GetOffersOptions,
} from "@bluxcc/core/dist/exports/core/getOffers";

import { getNetwork } from '../utils';
import type { WithoutQueryInternals } from '../utils';

type R = GetOffersResult;
type O = GetOffersOptions;

export function useOffers(
  options?: O,
  queryOptions?: WithoutQueryInternals<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forAccount,
    options?.buying,
    options?.selling,
    options?.sponsor,
    options?.seller,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'offers', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getOffers(opts);
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