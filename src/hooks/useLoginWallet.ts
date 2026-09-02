import { loginWallet } from '@bluxcc/core';
import type { IUser } from '@bluxcc/core';

import {
  LoginActionState,
  UseLoginActionOptions,
  useLoginAction,
} from './useLoginAction';

export type UseLoginWalletOptions = UseLoginActionOptions<IUser>;

export type UseLoginWalletResult = LoginActionState<IUser> & {
  loginWallet: (walletName?: string) => void;
  loginWalletAsync: (walletName?: string) => Promise<IUser>;
  reset: () => void;
};

/**
 * Wallet login.
 *
 * - No argument: opens the Blux onboarding modal showing only the wallet list
 *   (email / SMS / social / passkey rows are hidden).
 * - With a wallet name (`'freighter'`, `'rabet'`, …): opens that wallet's own
 *   prompt and never the Blux modal. WalletConnect is the exception and still
 *   uses the Blux QR screen. Named-wallet calls must run from a click handler.
 *
 * Wraps core `loginWallet`. Wallet must be in `config.loginMethods`.
 *
 * @param options - Optional `onSuccess` / `onError` / `onSettled`.
 * @returns `loginWallet` / `loginWalletAsync` plus status (`isPending`, `data`,
 *   `error`, …).
 *
 * @example
 * ```tsx
 * const { loginWallet, isPending, error } = useLoginWallet();
 *
 * <button onClick={() => loginWallet()}>Choose a wallet</button>
 * <button onClick={() => loginWallet('freighter')}>Freighter</button>
 * ```
 */
export function useLoginWallet(
  options?: UseLoginWalletOptions,
): UseLoginWalletResult {
  const { mutate, mutateAsync, ...rest } = useLoginAction(
    (walletName?: string) => loginWallet(walletName),
    options,
  );

  return {
    ...rest,
    loginWallet: mutate,
    loginWalletAsync: mutateAsync,
  };
}
