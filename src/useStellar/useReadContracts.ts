import { useMemo } from 'react';
import { readContracts } from '@bluxcc/core';
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  IContractCall,
  ReadContractsOptions,
} from '@bluxcc/core/dist/exports/utils';

import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = Awaited<ReturnType<typeof readContracts>>;
type O = ReadContractsOptions;

export function useReadContracts(
  calls: IContractCall[],
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const serializedCalls = useMemo(
    () =>
      JSON.stringify(
        (calls ?? []).map((call) => ({
          address: call?.address,
          fn: call?.fn,
          args: (call?.args ?? []).map((arg) => arg.toXDR('base64')),
        })),
      ),
    [calls],
  );

  const deps = [
    network,
    serializedCalls,
  ];

  const queryKey = useMemo(
    () => ['blux', 'readContracts', network, serializedCalls],
    [...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return readContracts(calls, opts);
    },
    [...deps],
  );

  const result = useQuery<R, Error>({
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
    enabled,
    queryKey,
    queryFn,
  });

  return result;
}
