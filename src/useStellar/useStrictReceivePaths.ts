import { useMemo } from 'react';
import { getStrictReceivePaths } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetPaymentPathResult
} from "@bluxcc/core/dist/exports/core/getStrictReceivePaths";

import { Asset } from '@stellar/stellar-sdk';
import { CallBuilderOptions, getNetwork } from '../utils';
import type { WithoutQueryInternals } from '../utils';

type R = GetPaymentPathResult;
type O = CallBuilderOptions;

export function useStrictReceivePaths(
  args: [
    source: string | Asset[],
    destinationAsset: Asset,
    destinationAmount: string,
  ],
  options?: O,
  queryOptions?: WithoutQueryInternals<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    args[0],
    args[1],
    args[2],
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'strictReceivePaths', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getStrictReceivePaths(args, opts);
    },
    [network, options, ...deps],
  );

  const result = useQuery<R, Error>({
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
    enabled,
    queryKey,
    queryFn,
  });

  return result;
}