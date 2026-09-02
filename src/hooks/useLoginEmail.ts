import { loginEmail } from '@bluxcc/core';

import { useLoginCode } from './useLoginCode';
import type { UseLoginCodeOptions, UseLoginCodeResult } from './useLoginCode';

export type UseLoginEmailOptions = UseLoginCodeOptions;
export type UseLoginEmailResult = UseLoginCodeResult;

/**
 * Headless email login: send a one-time code, then verify it.
 *
 * Wraps core `loginEmail` (`sendCode` + `loginWithCode`). Does not open the
 * Blux modal; render your own email / OTP UI. Email must be in
 * `config.loginMethods`.
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
 * } = useLoginEmail();
 *
 * await sendCodeAsync('user@example.com');
 * const user = await loginWithCodeAsync('user@example.com', '123456');
 * ```
 */
export function useLoginEmail(
  options?: UseLoginEmailOptions,
): UseLoginEmailResult {
  return useLoginCode(loginEmail, options);
}
