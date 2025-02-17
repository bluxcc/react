import React, { createContext, useState, useEffect, useContext } from 'react';

import ConnectModal from '../containers/ConnectModal';
import { ContextState, IProviderConfig, ContextValues, IAppearance, Routes } from '../types';
import { defaultAppearance } from '../constants/defaultAppearance';

export const ProviderContext = createContext<ContextState | null>(null);

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
  const [route, setRoute] = useState<Routes>(Routes.ONBOARDING);
  const [value, setValue] = useState<ContextValues>({
    config,
    appearance: appearance ?? defaultAppearance,
    isDemo: isDemo ?? false,
    user: { wallet: null },
    openModal: false,
    isReady: false,
    isAuthenticated: false,
    modalState: 'connecting',
    signTransaction: {
      xdr: '',
      resolver: null,
      latestResults: null,
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
    <ProviderContext.Provider value={{ value, setValue, route, setRoute }}>
      {children}
      <ConnectModal isOpen={value.openModal} closeModal={closeModal} />
    </ProviderContext.Provider>
  );
};

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within a ProviderContext.');
  }
  return context;
};
