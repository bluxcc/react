import { writeContract } from '@bluxcc/core';
import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import type {
  IContractCall,
  WriteContractsOptions,
} from '@bluxcc/core';

import type { MutationOptions } from '../utils';

type CoreWriteContractResult = Awaited<ReturnType<typeof writeContract>>;

/** Submitted transaction with a caller-specified decoded contract result. */
export type WriteContractHookResult<TReturnValue = unknown> = Omit<
  CoreWriteContractResult,
  'returnValue'
> & {
  returnValue: () => Promise<TReturnValue | null>;
};

/**
 * Variables for {@link useWriteContract}: the contract `call` to invoke and
 * optional core write `options` (e.g. `network`).
 */
export type WriteContractVariables = {
  call: IContractCall;
  options?: WriteContractsOptions;
};

type V = WriteContractVariables;

/**
 * Submits a state-changing Soroban contract invocation as a signed, on-chain
 * transaction. Native positional arguments are encoded from the deployed
 * contract ABI; pre-built `xdr.ScVal`s are also accepted.
 *
 * A thin wrapper over TanStack Query's `useMutation`: call `mutate` /
 * `mutateAsync` with the contract call to sign and send it. For read-only calls
 * (no signature, no fees) use `useReadContract` or `useReadContracts` instead.
 *
 * @param mutationOptions - Optional TanStack Mutation options (`onSuccess`,
 *   `onError`, `onSettled`, …); `mutationFn` is provided by the hook.
 * @returns A TanStack mutation result. Call `mutate({ call, options })` (or
 *   `mutateAsync`) to send; read `data`, `isPending`, `isSuccess`, `error`,
 *   `reset`, etc. for state.
 *
 * @example
 * ```tsx
 * const { mutateAsync, isPending } = useWriteContract<bigint>();
 *
 * const transaction = await mutateAsync({
 *   call: {
 *     address: 'token.xlm',
 *     fn: 'transfer',
 *     args: ['alice.xlm', 'bob.xlm', 1_000_000],
 *   },
 * });
 * const result = await transaction.returnValue(); // bigint | null
 * ```
 */
export function useWriteContract<TReturnValue = unknown>(
  mutationOptions?: MutationOptions<WriteContractHookResult<TReturnValue>, V>,
): UseMutationResult<WriteContractHookResult<TReturnValue>, Error, V> {
  return useMutation<WriteContractHookResult<TReturnValue>, Error, V>({
    ...(mutationOptions as
      | UseMutationOptions<WriteContractHookResult<TReturnValue>, Error, V>
      | undefined),
    mutationFn: async ({ call, options }) =>
      writeContract(call, options) as Promise<
        WriteContractHookResult<TReturnValue>
      >,
  });
}
