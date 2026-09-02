import { useCallback, useRef, useState } from 'react';

export type LoginStatus = 'idle' | 'pending' | 'success' | 'error';

export type UseLoginActionOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: TData | undefined, error: Error | null) => void;
};

export type LoginActionState<TData> = {
  data: TData | undefined;
  error: Error | null;
  isError: boolean;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  status: LoginStatus;
};

export type LoginActionResult<
  TArgs extends unknown[],
  TData,
> = LoginActionState<TData> & {
  reset: () => void;
  mutate: (...args: TArgs) => void;
  mutateAsync: (...args: TArgs) => Promise<TData>;
};

const idleState = <TData>(): LoginActionState<TData> => ({
  data: undefined,
  error: null,
  isError: false,
  isIdle: true,
  isPending: false,
  isSuccess: false,
  status: 'idle',
});

const toError = (cause: unknown): Error =>
  cause instanceof Error ? cause : new Error(String(cause));

/**
 * Async action helper for login methods. Calls `fn` in the same turn as the
 * click handler so OAuth popups, WebAuthn, and wallet extensions keep the
 * user gesture. Do not `await` anything before `fn` runs.
 */
export function useLoginAction<TArgs extends unknown[], TData>(
  fn: (...args: TArgs) => Promise<TData>,
  options?: UseLoginActionOptions<TData>,
): LoginActionResult<TArgs, TData> {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [state, setState] = useState<LoginActionState<TData>>(idleState);

  const reset = useCallback(() => {
    setState(idleState());
  }, []);

  const mutateAsync = useCallback(async (...args: TArgs): Promise<TData> => {
    setState({
      data: undefined,
      error: null,
      isError: false,
      isIdle: false,
      isPending: true,
      isSuccess: false,
      status: 'pending',
    });

    try {
      const data = await fnRef.current(...args);

      setState({
        data,
        error: null,
        isError: false,
        isIdle: false,
        isPending: false,
        isSuccess: true,
        status: 'success',
      });
      optionsRef.current?.onSuccess?.(data);
      optionsRef.current?.onSettled?.(data, null);

      return data;
    } catch (cause) {
      const error = toError(cause);

      setState({
        data: undefined,
        error,
        isError: true,
        isIdle: false,
        isPending: false,
        isSuccess: false,
        status: 'error',
      });
      optionsRef.current?.onError?.(error);
      optionsRef.current?.onSettled?.(undefined, error);

      throw error;
    }
  }, []);

  const mutate = useCallback(
    (...args: TArgs) => {
      mutateAsync(...args).catch(() => {});
    },
    [mutateAsync],
  );

  return {
    ...state,
    reset,
    mutate,
    mutateAsync,
  };
}
