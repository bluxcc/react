import { useMemo } from 'react';
import { getAssets } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetAssetsResult,
  GetAssetsOptions,
} from "@bluxcc/core/dist/exports/core/getAssets";

import { getNetwork } from '../utils';

type R = GetAssetsResult;
type O = GetAssetsOptions;

export function useAssets(
  options?: O,
  queryOptions?: UseQueryOptions<R, Error>,
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forCode,
    options?.forIssuer,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'assets', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getAssets(opts);
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