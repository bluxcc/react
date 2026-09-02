import { loginPasskey } from '@bluxcc/core';
import type { IUser } from '@bluxcc/core';

import {
  LoginActionState,
  UseLoginActionOptions,
  useLoginAction,
} from './useLoginAction';

export type UseLoginPasskeyOptions = UseLoginActionOptions<IUser>;

export type UseLoginPasskeyResult = LoginActionState<IUser> & {
  loginPasskey: () => void;
  loginPasskeyAsync: () => Promise<IUser>;
  reset: () => void;
};

/**
 * Headless passkey login. Triggers the WebAuthn ceremony (register on first
 * visit, assert on later visits). Must run from a user gesture. Does not open
 * the Blux modal.
 *
 * Wraps core `loginPasskey`. Passkey must be in `config.loginMethods`.
 *
 * @param options - Optional `onSuccess` / `onError` / `onSettled`.
 * @returns `loginPasskey` / `loginPasskeyAsync` plus status (`isPending`,
 *   `data`, `error`, …).
 *
 * @example
 * ```tsx
 * const { loginPasskey, isPending, error } = useLoginPasskey();
 *
 * <button onClick={() => loginPasskey()} disabled={isPending}>
 *   Continue with passkey
 * </button>
 * ```
 */
export function useLoginPasskey(
  options?: UseLoginPasskeyOptions,
): UseLoginPasskeyResult {
  const { mutate, mutateAsync, ...rest } = useLoginAction(
    () => loginPasskey(),
    options,
  );

  return {
    ...rest,
    loginPasskey: mutate,
    loginPasskeyAsync: mutateAsync,
  };
}
