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
} from '@bluxcc/core';

import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type CoreReadContractsResult = Exclude<
  Awaited<ReturnType<typeof readContracts>>,
  readonly unknown[]
>;

/** Typed result returned by {@link useReadContracts}. */
export type ReadContractsHookResult<
  TValues extends readonly unknown[] = readonly unknown[],
> = Omit<CoreReadContractsResult, 'values'> & {
  /** Decoded return values, index-aligned with the supplied calls. */
  values: TValues;
};

type O = ReadContractsOptions;

const serializeCalls = (calls: readonly IContractCall[]): string =>
  JSON.stringify(calls ?? [], (_key, value: unknown) => {
    if (typeof value === 'bigint') {
      return { __bluxBigInt: value.toString() };
    }

    if (
      value &&
      typeof value === 'object' &&
      'toXDR' in value &&
      typeof value.toXDR === 'function'
    ) {
      return { __bluxXdr: value.toXDR('base64') };
    }

    if (value instanceof Map) {
      return { __bluxMap: Array.from(value.entries()) };
    }

    if (value instanceof Uint8Array) {
      return { __bluxBytes: Array.from(value) };
    }

    return value;
  });

/**
 * Reads from one or more Soroban contracts by simulating their calls — no
 * transaction is submitted, so no signature or fees are required.
 *
 * Each call names a contract `address`, a function `fn`, and a positional
 * `args` array. Native values are encoded from the deployed contract ABI, and
 * pre-built `xdr.ScVal`s remain supported. Results come back already decoded
 * in `data.values`, with the raw simulation in `data.raws`. For state-changing
 * calls use `useWriteContract` instead.
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
 * const { data } = useReadContracts<[string, boolean]>([
 *   { address: 'token.xlm', fn: 'balance', args: ['alice.xlm'] },
 *   { address: 'token.xlm', fn: 'authorized', args: ['alice.xlm'] },
 * ]);
 * const balance = data?.values[0]; // string
 * ```
 */
export function useReadContracts<
  TValues extends readonly unknown[] = readonly unknown[],
>(
  calls: readonly IContractCall[],
  options?: O,
  queryOptions?: QueryOptions<ReadContractsHookResult<TValues>>,
): UseQueryResult<ReadContractsHookResult<TValues>, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const serializedCalls = useMemo(() => serializeCalls(calls), [calls]);

  const deps = [network, serializedCalls];

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

      return readContracts([...calls], opts) as unknown as Promise<
        ReadContractsHookResult<TValues>
      >;
    },
    [...deps],
  );

  const result = useQuery<ReadContractsHookResult<TValues>, Error>({
    ...(queryOptions as
      | UseQueryOptions<ReadContractsHookResult<TValues>, Error>
      | undefined),
    enabled,
    queryKey,
    queryFn,
  });

  return result;
}
