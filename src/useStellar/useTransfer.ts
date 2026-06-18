import { transfer } from '@bluxcc/core';
import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import type { TransferOptions } from '@bluxcc/core/dist/exports/core/transfer';

import type { MutationOptions } from '../utils';

type R = Awaited<ReturnType<typeof transfer>>;

/**
 * Variables for {@link useTransfer} — the core `transfer` options verbatim, so
 * every path it supports (native XLM, issued asset, claimable balance, SEP-41
 * token, federated address) is just a different object passed to
 * `transfer({ ... })`.
 */
export type TransferVariables = TransferOptions;

type V = TransferVariables;

/**
 * Return type of {@link useTransfer}: the full TanStack mutation result plus
 * wagmi-style aliases — `transfer` (alias of `mutate`, fire-and-forget) and
 * `transferAsync` (alias of `mutateAsync`, returns a promise).
 */
export type UseTransferResult = UseMutationResult<R, Error, V> & {
  transfer: UseMutationResult<R, Error, V>['mutate'];
  transferAsync: UseMutationResult<R, Error, V>['mutateAsync'];
};

/**
 * Sends value from the connected wallet to a recipient — native XLM, an issued
 * asset, or a SEP-41 token — by wrapping the core `transfer` in a TanStack
 * mutation.
 *
 * The core call picks the right operation for you (create-account vs. payment
 * vs. claimable balance for classic assets, or the token contract's `transfer`
 * when `token` is set), so callers just describe the transfer. Named after
 * wagmi's `useSendTransaction` / `useWriteContract`: fire `transfer({ ... })`
 * (fire-and-forget) or `await transferAsync({ ... })`.
 *
 * @param mutationOptions - Optional TanStack Mutation options (`onSuccess`,
 *   `onError`, `onSettled`, …); a common use is invalidating `useBalances` on
 *   success. `mutationFn` is provided by the hook.
 * @returns The TanStack mutation result plus `transfer` (alias of `mutate`) and
 *   `transferAsync` (alias of `mutateAsync`); read `data` (the submitted
 *   transaction), `isPending`, `isSuccess`, `error`, `reset`, etc. for state.
 *
 * @example
 * ```tsx
 * const { transfer, transferAsync, isPending, error } = useTransfer();
 *
 * // Native XLM
 * transfer({ to: 'GB…', amount: '10.5' });
 *
 * // Issued asset, falling back to a claimable balance if the recipient
 * // cannot receive it directly
 * transfer({ to: 'GB…', amount: '10', asset: 'USDC:GA…', claimable: true });
 *
 * // SEP-41 token (integer base units)
 * transfer({ to: 'GB…', amount: '1000000', token: 'C…' });
 *
 * // Await the result (e.g. in a form submit handler)
 * const tx = await transferAsync({ to: 'alice*example.com', amount: '5' });
 * ```
 */
export function useTransfer(
  mutationOptions?: MutationOptions<R, V>
): UseTransferResult {
  const mutation = useMutation<R, Error, V>({
    ...(mutationOptions as UseMutationOptions<R, Error, V> | undefined),
    mutationFn: async (variables) => transfer(variables),
  });

  return Object.assign(mutation, {
    transfer: mutation.mutate,
    transferAsync: mutation.mutateAsync,
  });
}
