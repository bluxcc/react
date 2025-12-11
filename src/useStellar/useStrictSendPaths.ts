import { useMemo } from 'react';
import { getStrictSendPaths } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetPaymentPathResult
} from "@bluxcc/core/dist/exports/core/getStrictSendPaths";

import { Asset } from '@stellar/stellar-sdk';
import { CallBuilderOptions, getNetwork } from '../utils';
import type { WithoutQueryInternals } from '../utils';

type R = GetPaymentPathResult;
type O = CallBuilderOptions;

export function useStrictSendPaths(
  args: [
    sourceAsset: Asset,
    sourceAmount: string,
    destination: string | Asset[],
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
    () => ['blux', 'strictSendPaths', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getStrictSendPaths(args, opts);
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