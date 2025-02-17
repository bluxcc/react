import React, { createContext, useState, useEffect, useContext } from 'react';

import ConnectModal from '../containers/ConnectModal';
import { ContextState, IProviderConfig, BluxContextValues, IAppearance } from '../types';
import { defaultAppearance } from '../constants/defaultAppearance';
import { ModalProvider } from './modalProvider';

export const BluxProviderContext = createContext<ContextState | null>(null);

export const BluxProvider = ({
  config,
  isDemo,
  appearance,
  children,
}: {
  isDemo?: boolean;
  appearance?: IAppearance;
  config: IProviderConfig;
  children: React.ReactNode;
}) => {
  const [value, setValue] = useState<BluxContextValues>({
    config,
    appearance: appearance ?? defaultAppearance,
    isDemo: isDemo ?? false,
    user: { wallet: null },
    openModal: false,
    isReady: false,
    isAuthenticated: false,
    isConnecting: false,
    connectSuccess: false,
    connectRejected: false,
    signTx: {
      openModal: false,
      xdr: '',
      resolver: null,
    },
    availableWallets: [],
  });

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      appearance: appearance ?? defaultAppearance,
    }));
  }, [appearance]);

  const closeModal = () => {
    setValue((prev) => ({
      ...prev,
      openModal: false,
    }));
  };

  return (
    <BluxProviderContext.Provider value={{ value, setValue }}>
      {children}
      <ModalProvider>
        <ConnectModal isOpen={value.openModal} closeModal={closeModal} />
      </ModalProvider>
    </BluxProviderContext.Provider>
  );
};

export const useBluxProvider = () => {
  const context = useContext(BluxProviderContext);
  if (!context) {
    throw new Error('useBluxProvider must be used within a ProviderContext.');
  }
  return context;
};
