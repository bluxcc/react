import { useMemo } from 'react';
import { readContract } from '@bluxcc/core';
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

type CoreReadContractResult = Awaited<ReturnType<typeof readContract>>;

/** Typed result returned by {@link useReadContract}. */
export type ReadContractHookResult<TReturnValue = unknown> = Omit<
  CoreReadContractResult,
  'value'
> & {
  /** Decoded return value of the contract call. */
  value: TReturnValue;
};

type O = ReadContractsOptions;

const serializeCall = (call: IContractCall): string =>
  JSON.stringify(call ?? {}, (_key, value: unknown) => {
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
 * Reads one Soroban contract function by simulating it — no transaction is
 * submitted, so no signature or fees are required.
 *
 * The call names a contract `address`, a function `fn`, and a positional
 * `args` array. Native values are encoded from the deployed contract ABI, and
 * pre-built `xdr.ScVal`s remain supported. The result comes back already
 * decoded in `data.value`, with the raw simulation in `data.raw`. For several
 * calls at once use `useReadContracts`. For state-changing calls use
 * `useWriteContract`.
 *
 * @param call - The contract call to simulate, `{ address, fn, args }`.
 * @param options - Optional `network` (defaults to the active network).
 * @param queryOptions - Optional TanStack Query options (`enabled`, `staleTime`,
 *   …). `queryKey`/`queryFn` are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ raw, value }`.
 *
 * @example
 * ```tsx
 * const { data } = useReadContract<string>({
 *   address: 'token.xlm',
 *   fn: 'balance',
 *   args: ['alice.xlm'],
 * });
 * const balance = data?.value; // string
 * ```
 */
export function useReadContract<TReturnValue = unknown>(
  call: IContractCall,
  options?: O,
  queryOptions?: QueryOptions<ReadContractHookResult<TReturnValue>>,
): UseQueryResult<ReadContractHookResult<TReturnValue>, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const serializedCall = useMemo(() => serializeCall(call), [call]);

  const deps = [network, serializedCall];

  const queryKey = useMemo(
    () => ['blux', 'readContract', network, serializedCall],
    [...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return readContract(call, opts) as Promise<
        ReadContractHookResult<TReturnValue>
      >;
    },
    [...deps],
  );

  const result = useQuery<ReadContractHookResult<TReturnValue>, Error>({
    ...(queryOptions as
      | UseQueryOptions<ReadContractHookResult<TReturnValue>, Error>
      | undefined),
    enabled,
    queryKey,
    queryFn,
  });

  return result;
}
