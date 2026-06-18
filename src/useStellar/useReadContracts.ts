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

/**
 * Reads from one or more Soroban contracts by simulating their calls — no
 * transaction is submitted, so no signature or fees are required.
 *
 * Each call names a contract `address`, a function `fn`, and its `args` as
 * `xdr.ScVal`s — build those with the exported `ToScVal` helpers. Results come
 * back already decoded in `data.values`, with the raw simulation in `data.raws`.
 * For state-changing calls use `useWriteContract` instead.
 *
 * @param calls - The contract calls to simulate, each `{ address, fn, args }`.
 * @param options - Optional `network` (defaults to the active network).
 * @param queryOptions - Optional TanStack Query options (`enabled`, `staleTime`,
 *   …). `queryKey`/`queryFn` are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ raws, values }` — `values` are
 *   the decoded return values, index-aligned with `calls`.
 *
 * @example
 * ```tsx
 * const { data } = useReadContracts([
 *   { address: 'C…', fn: 'balance', args: [ToScVal.address('GA…')] },
 * ]);
 * const balance = data?.values[0];
 * ```
 */
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
