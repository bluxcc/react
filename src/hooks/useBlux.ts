import { Horizon, rpc } from '@stellar/stellar-sdk';

import { useProvider } from '../context/provider';
import getTransactionDetails from '../utils/stellar/getTransactionDetails';
import { ISendTransactionOptions, ISendTransactionOptionsInternal, ISignTransaction, Routes } from '../types';

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
      user: { ...prev.user, wallet: null },
      isModalOpen: false,
      isAuthenticated: false,
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
    options: ISendTransactionOptions & { isSoroban: true }
  ): Promise<rpc.Api.GetSuccessfulTransactionResponse>;
  function sendTransaction(
    xdr: string, 
    options?: ISendTransactionOptions & { isSoroban?: false }
  ): Promise<Horizon.HorizonApi.SubmitTransactionResponse>;
  function sendTransaction(
    xdr: string, 
    options?: ISendTransactionOptions
  ): Promise<rpc.Api.GetSuccessfulTransactionResponse | Horizon.HorizonApi.SubmitTransactionResponse> {
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

      setRoute(Routes.SIGN_TRANSACTION);

      if (options?.isSoroban === true) {
      const sorobanOptions: ISendTransactionOptionsInternal = {
        network,
        isSoroban: true,
      };
      
      setValue((prev) => ({
        ...prev,
        isModalOpen: true,
        signTransaction: {
          xdr,
          options: sorobanOptions,
          resolver: resolve,
          rejecter: reject,
          result: null
        } as ISignTransaction<true>,
      }));
    } else {
      const regularOptions: ISendTransactionOptionsInternal = {
        network,
        isSoroban: false
      };
      
      setValue((prev) => ({
        ...prev,
        isModalOpen: true,
        signTransaction: {
          xdr,
          options: regularOptions,
          resolver: resolve,
          rejecter: reject,
          result: null
        } as ISignTransaction<false>,
      }));
    }
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
