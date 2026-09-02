import { loginSms } from '@bluxcc/core';

import { useLoginCode } from './useLoginCode';
import type { UseLoginCodeOptions, UseLoginCodeResult } from './useLoginCode';

export type UseLoginSmsOptions = UseLoginCodeOptions;
export type UseLoginSmsResult = UseLoginCodeResult;

/**
 * Headless SMS login: send a one-time code, then verify it.
 *
 * Wraps core `loginSms` (`sendCode` + `loginWithCode`). Does not open the
 * Blux modal; render your own phone / OTP UI. SMS must be in
 * `config.loginMethods` and the app must be on a paid plan.
 *
 * @param options - Optional `onCodeSent`, plus `onSuccess` / `onError` /
 *   `onSettled` for the verify step (`onError` also runs if sending fails).
 * @returns `sendCode` / `sendCodeAsync`, `loginWithCode` / `loginWithCodeAsync`,
 *   and status (`isSendingCode`, `isLoggingIn`, `isCodeSent`, `data`, `error`).
 *
 * @example
 * ```tsx
 * const {
 *   sendCodeAsync,
 *   loginWithCodeAsync,
 *   isSendingCode,
 *   isLoggingIn,
 *   isCodeSent,
 *   error,
 * } = useLoginSms();
 *
 * await sendCodeAsync('+15555555555');
 * const user = await loginWithCodeAsync('+15555555555', '123456');
 * ```
 */
export function useLoginSms(options?: UseLoginSmsOptions): UseLoginSmsResult {
  return useLoginCode(loginSms, options);
}
