import { loginOAuth } from '@bluxcc/core';
import type { ISocialProvider, IUser, LoginOAuthOptions } from '@bluxcc/core';

import {
  LoginActionState,
  UseLoginActionOptions,
  useLoginAction,
} from './useLoginAction';

export type { LoginOAuthOptions };

export type UseLoginOAuthOptions = UseLoginActionOptions<IUser>;

export type UseLoginOAuthResult = LoginActionState<IUser> & {
  loginOAuth: (
    provider: ISocialProvider | string,
    options?: LoginOAuthOptions,
  ) => void;
  loginOAuthAsync: (
    provider: ISocialProvider | string,
    options?: LoginOAuthOptions,
  ) => Promise<IUser>;
  reset: () => void;
};

/**
 * Headless social login. Opens the provider popup (must run from a click
 * handler so the browser does not block it) and resolves with the user.
 *
 * Wraps core `loginOAuth`. Telegram cannot use that popup; pass the widget
 * payload as `options.telegramUser`, or call this from a Mini App where init
 * data is present. To show Blux's Telegram widget instead, use `useBlux().login()`.
 *
 * @param options - Optional `onSuccess` / `onError` / `onSettled`.
 * @returns `loginOAuth` / `loginOAuthAsync` plus status (`isPending`, `data`,
 *   `error`, …).
 *
 * @example
 * ```tsx
 * const { loginOAuth, isPending, error } = useLoginOAuth();
 *
 * <button onClick={() => loginOAuth('google')} disabled={isPending}>
 *   Continue with Google
 * </button>
 * ```
 */
export function useLoginOAuth(
  options?: UseLoginOAuthOptions,
): UseLoginOAuthResult {
  const { mutate, mutateAsync, ...rest } = useLoginAction(
    (provider: ISocialProvider | string, oauthOptions?: LoginOAuthOptions) =>
      loginOAuth(provider, oauthOptions),
    options,
  );

  return {
    ...rest,
    loginOAuth: mutate,
    loginOAuthAsync: mutateAsync,
  };
}
