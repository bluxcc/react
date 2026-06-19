import { swap } from '@bluxcc/core';
import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import type { SwapOptions } from '@bluxcc/core/dist/exports/core/swap';

import type { MutationOptions } from '../utils';

type R = Awaited<ReturnType<typeof swap>>;

/**
 * Variables for {@link useSwap} — the core `swap` options verbatim, so every
 * knob it supports (`type` exactIn/exactOut, `slippage`, `to`, `memo`,
 * `network`) is just a field on the object passed to `swap({ ... })`.
 */
export type SwapVariables = SwapOptions;

type V = SwapVariables;

/**
 * Return type of {@link useSwap}: the full TanStack mutation result plus
 * wagmi-style aliases — `swap` (alias of `mutate`, fire-and-forget) and
 * `swapAsync` (alias of `mutateAsync`, returns a promise).
 */
export type UseSwapResult = UseMutationResult<R, Error, V> & {
  swap: UseMutationResult<R, Error, V>['mutate'];
  swapAsync: UseMutationResult<R, Error, V>['mutateAsync'];
};

/**
 * Swaps one asset for another through the Stellar DEX / liquidity pools by
 * wrapping the core `swap` in a TanStack mutation.
 *
 * The core call discovers the best path payment automatically and applies a
 * slippage guardrail, so callers just describe the trade. `type: 'exactIn'`
 * (the default) sends a fixed `amount` of `fromAsset` and lets the received
 * amount float; `type: 'exactOut'` receives a fixed `amount` of `toAsset` and
 * lets the spent amount float. Defaults to a self-swap; pass `to` to deliver the
 * bought asset elsewhere. When it is a self-swap into an asset the account has
 * never held, the required `changeTrust` is added automatically. Requires a
 * logged-in account.
 *
 * Named after wagmi's mutation hooks: fire `swap({ ... })` (fire-and-forget) or
 * `await swapAsync({ ... })`.
 *
 * @param mutationOptions - Optional TanStack Mutation options (`onSuccess`,
 *   `onError`, `onSettled`, …); a common use is invalidating `useBalances` on
 *   success. `mutationFn` is provided by the hook.
 * @returns The TanStack mutation result plus `swap` (alias of `mutate`) and
 *   `swapAsync` (alias of `mutateAsync`); read `data` (the submitted
 *   transaction), `isPending`, `isSuccess`, `error`, `reset`, etc. for state.
 *
 * @example
 * ```tsx
 * const { swap, swapAsync, isPending, error } = useSwap();
 *
 * // Sell exactly 100 XLM for USDC (exactIn is the default).
 * swap({ fromAsset: 'xlm', toAsset: 'USDC:GA…', amount: '100' });
 *
 * // Receive exactly 50 USDC, spending up to a slippage-bounded amount of XLM.
 * swap({ fromAsset: 'xlm', toAsset: 'USDC:GA…', amount: '50', type: 'exactOut' });
 *
 * // Deliver the bought asset to another account, with tighter slippage + a memo.
 * const tx = await swapAsync({
 *   fromAsset: 'USDC:GA…',
 *   toAsset: 'xlm',
 *   amount: '25',
 *   to: 'GB…',
 *   slippage: 0.01, // 1%
 *   memo: 'cash out',
 * });
 * ```
 */
export function useSwap(
  mutationOptions?: MutationOptions<R, V>
): UseSwapResult {
  const mutation = useMutation<R, Error, V>({
    ...(mutationOptions as UseMutationOptions<R, Error, V> | undefined),
    mutationFn: async (variables) => swap(variables),
  });

  return Object.assign(mutation, {
    swap: mutation.mutate,
    swapAsync: mutation.mutateAsync,
  });
}
