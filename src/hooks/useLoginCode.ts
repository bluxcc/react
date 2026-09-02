import type { IUser, LoginCodeApi } from '@bluxcc/core';

import {
  LoginStatus,
  UseLoginActionOptions,
  useLoginAction,
} from './useLoginAction';

export type UseLoginCodeOptions = UseLoginActionOptions<IUser> & {
  /** Called after a one-time code is sent successfully. */
  onCodeSent?: () => void;
};

export type UseLoginCodeResult = {
  sendCode: (identifier: string) => void;
  sendCodeAsync: (identifier: string) => Promise<void>;
  loginWithCode: (identifier: string, code: string) => void;
  loginWithCodeAsync: (identifier: string, code: string) => Promise<IUser>;
  data: IUser | undefined;
  error: Error | null;
  isCodeSent: boolean;
  isError: boolean;
  isIdle: boolean;
  isLoggingIn: boolean;
  isPending: boolean;
  isSendingCode: boolean;
  isSuccess: boolean;
  reset: () => void;
  status: LoginStatus;
};

export function useLoginCode(
  api: LoginCodeApi,
  options?: UseLoginCodeOptions,
): UseLoginCodeResult {
  const send = useLoginAction(
    (identifier: string) => api.sendCode(identifier),
    {
      onSuccess: () => options?.onCodeSent?.(),
      onError: options?.onError,
    },
  );

  const login = useLoginAction(
    (identifier: string, code: string) => api.loginWithCode(identifier, code),
    {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
      onSettled: options?.onSettled,
    },
  );

  const isPending = send.isPending || login.isPending;
  const error = login.error ?? send.error;

  return {
    sendCode: send.mutate,
    sendCodeAsync: send.mutateAsync,
    loginWithCode: login.mutate,
    loginWithCodeAsync: login.mutateAsync,
    data: login.data,
    error,
    isCodeSent: send.isSuccess,
    isError: !!error && !isPending,
    isIdle: send.isIdle && login.isIdle,
    isLoggingIn: login.isPending,
    isPending,
    isSendingCode: send.isPending,
    isSuccess: login.isSuccess,
    reset: () => {
      send.reset();
      login.reset();
    },
    status: isPending
      ? 'pending'
      : login.isSuccess
        ? 'success'
        : error
          ? 'error'
          : 'idle',
  };
}
