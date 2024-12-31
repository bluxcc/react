import React, { createContext, useContext, useMemo, useState } from 'react';
import { walletConfigs } from './walletsConfig';
import { SupportedWallets } from '../types';

interface WalletProviderConfig {
  appName: string;
  networkPassphrase: string;
}

interface SignTransactionOptions {
  networkPassphrase?: string;
  address?: string;
  submit?: boolean;
}

interface WalletContextType {
  config: WalletProviderConfig;
  errorMessage: string | null;
}

type ProviderProps = {
  config: WalletProviderConfig;
  children: React.ReactNode;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ config, children }: ProviderProps) => {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const walletsList = useMemo(
    () =>
      Object.entries(walletConfigs).map(([type, details]) => ({
        type,
        ...details,
      })),
    [],
  );

  const connect = async (walletType: SupportedWallets) => {
    setErrorMessage(null);
    const wallet = walletConfigs[walletType];

    try {
      if (!(await wallet.isAvailable())) {
        throw new Error(`${wallet.name} is not available.`);
      }
      const result = await wallet.connect();
      setConnectedWallet(result.publicKey);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const disconnect = () => {
    setConnectedWallet(null);
  };

  const signTransaction = async (
    walletType: SupportedWallets,
    xdr: string,
    options?: SignTransactionOptions,
  ) => {
    const wallet = walletConfigs[walletType];
    if (!wallet.signTransaction) {
      throw new Error(`${wallet.name} does not support signing transactions.`);
    }

    try {
      return await wallet.signTransaction(xdr, {
        submit: options?.submit,
        address: options?.address,
        networkPassphrase: options?.networkPassphrase,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      config,
      connectedWallet,
      errorMessage,
      walletsList,
      connect,
      disconnect,
      signTransaction,
    }),
    [config, connectedWallet, errorMessage],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
