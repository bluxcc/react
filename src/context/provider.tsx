import React, { createContext, useState, useEffect } from 'react';
import ConnectModal from '../containers/ConnectModal';
import { ContextState, IProviderConfig, ContextValues, IAppearance } from '../types';

export const ProviderContext = createContext<ContextState | null>(null);

export const defaultAppearance: IAppearance = {
  theme: 'light',
  background: '#FFFFFF',
  accent: '#0C1083',
  textColor: '#000000',
  font: 'Inter',
  cornerRadius: 'full',
  cover: '',
};

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
  const [value, setValue] = useState<ContextValues>({
    config,
    appearance: appearance ?? defaultAppearance,
    isDemo: isDemo ?? false,
    user: { wallet: null },
    openModal: false,
    isReady: false,
    isAuthenticated: false,
    isConnecting: false,
    connectRejected: false,
  });

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      appearance: appearance ?? defaultAppearance,
    }));
  }, [appearance]);

  return (
    <ProviderContext.Provider value={{ value, setValue }}>
      {children}
      <ConnectModal isOpen={value.openModal} />
    </ProviderContext.Provider>
  );
};
