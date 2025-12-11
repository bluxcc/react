import { useMemo } from 'react';
import { getOrderbook } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetOrderbookResult
} from "@bluxcc/core/dist/exports/core/getOrderbook";

import { Asset } from '@stellar/stellar-sdk';
import { CallBuilderOptions, getNetwork } from '../utils';
import type { WithoutQueryInternals } from '../utils';

type R = GetOrderbookResult;
type O = CallBuilderOptions;

export function useOrderbook(
  args: [selling: Asset, buying: Asset],
  options?: O,
  queryOptions?: WithoutQueryInternals<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    args[0],
    args[1],
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'orderbook', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getOrderbook(args, opts);
    },
    [network, options, ...deps],
  );

  return useQuery<R, Error>({
    queryKey,
    queryFn,
    enabled,
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
  });
}
