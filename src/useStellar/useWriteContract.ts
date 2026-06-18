import { writeContract } from '@bluxcc/core';
import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import type {
  IContractCall,
  WriteContractsOptions,
} from '@bluxcc/core/dist/exports/utils';

import type { MutationOptions } from '../utils';

type R = Awaited<ReturnType<typeof writeContract>>;

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
 * transaction.
 *
 * A thin wrapper over TanStack Query's `useMutation`: call `mutate` /
 * `mutateAsync` with the contract call to sign and send it. Build `args` with
 * the exported `ToScVal` helpers. For read-only calls (no signature, no fees)
 * use `useReadContracts` instead.
 *
 * @param mutationOptions - Optional TanStack Mutation options (`onSuccess`,
 *   `onError`, `onSettled`, …); `mutationFn` is provided by the hook.
 * @returns A TanStack mutation result. Call `mutate({ call, options })` (or
 *   `mutateAsync`) to send; read `data`, `isPending`, `isSuccess`, `error`,
 *   `reset`, etc. for state.
 *
 * @example
 * ```tsx
 * const { mutate, isPending, data } = useWriteContract();
 *
 * mutate({
 *   call: {
 *     address: 'C…',
 *     fn: 'transfer',
 *     args: [
 *       ToScVal.address('GFROM…'),
 *       ToScVal.address('GTO…'),
 *       ToScVal.i128('1000000'),
 *     ],
 *   },
 * });
 * ```
 */
export function useWriteContract(
  mutationOptions?: MutationOptions<R, V>
): UseMutationResult<R, Error, V> {
  return useMutation<R, Error, V>({
    ...(mutationOptions as UseMutationOptions<R, Error, V> | undefined),
    mutationFn: async ({ call, options }) => writeContract(call, options),
  });
}
