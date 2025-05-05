import { Horizon, rpc } from '@stellar/stellar-sdk';

import { useProvider } from '../context/provider';
import getTransactionDetails from '../utils/stellar/getTransactionDetails';
import handleTransactionSigning from '../utils/stellar/handleTransactionSigning';
import {
  Routes,
  ISignTransaction,
  ISendTransactionOptions,
  ISendTransactionOptionsInternal,
} from '../types';

export const useBlux = () => {
  const context = useProvider();

  if (!context) {
    throw new Error('useBlux must be used within a ProviderContext.');
  }

  const { value, setValue, setRoute } = context;
  const { isReady, user, isAuthenticated } = value;

  const login = () => {
    if (!isReady) {
      throw new Error('Cannot connect when isReady is false.');
    }

    if (!isAuthenticated) {
      setValue((prev) =>
        prev.isModalOpen ? prev : { ...prev, isModalOpen: true },
      );
    } else {
      throw new Error('Already connected.');
    }
  };

  const logout = () => {
    setValue((prev) => ({
      ...prev,
      isModalOpen: false,
      user: { ...prev.user, wallet: null },
      isAuthenticated: false,
      waitingStatus: 'connecting',
    }));

    setRoute(Routes.ONBOARDING);
  };

  const profile = () => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated.');
    }

    setRoute(Routes.PROFILE);
    setValue((prev) => ({ ...prev, isModalOpen: true }));
  };

  function sendTransaction(
    xdr: string,
    options: ISendTransactionOptions & { isSoroban: true },
  ): Promise<rpc.Api.GetSuccessfulTransactionResponse>;
  function sendTransaction(
    xdr: string,
    options?: ISendTransactionOptions & { isSoroban?: false },
  ): Promise<Horizon.HorizonApi.SubmitTransactionResponse>;
  function sendTransaction(
    xdr: string,
    options?: ISendTransactionOptions,
  ): Promise<
    | rpc.Api.GetSuccessfulTransactionResponse
    | Horizon.HorizonApi.SubmitTransactionResponse
  > {
    return new Promise((resolve, reject) => {
      let network = value.activeNetwork;

      if (options && options.network) {
        network = options.network;
      }

      if (!isAuthenticated) {
        reject(new Error('User is not authenticated.'));
      }

      if (!getTransactionDetails(xdr, network)) {
        reject('Invalid XDR');

        return;
      }

      const ops: ISendTransactionOptionsInternal = {
        network,
        isSoroban: options?.isSoroban === true,
      };

      const normalTransactionObject: ISignTransaction<false> = {
        xdr,
        options: ops,
        resolver: resolve,
        rejecter: reject,
        result: null,
      };

      const sorobanTransactionObject: ISignTransaction<true> = {
        xdr,
        options: ops,
        resolver: resolve,
        rejecter: reject,
        result: null,
      };

      const foundWallet = value.availableWallets.find(
        ({ wallet }) => wallet.name === user?.wallet?.name,
      )?.wallet;

      if (!foundWallet) {
        throw new Error('Could not find the connected wallet.');
      }

      if (!value.config.showWalletUIs) {
        handleTransactionSigning(
          foundWallet,
          xdr,
          value.user.wallet?.address as string,
          ops,
          value.config.transports || {},
        )
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });

        return;
      }

      setRoute(Routes.SIGN_TRANSACTION);

      setValue((prev) => ({
        ...prev,
        isModalOpen: true,
        signTransaction:
          options?.isSoroban === true
            ? sorobanTransactionObject
            : normalTransactionObject,
      }));
    });
  }

  return {
    login,
    logout,
    profile,
    sendTransaction,
    user: user ?? null,
    isReady: value.isReady ?? false,
    isAuthenticated: isAuthenticated ?? false,
  };
};
