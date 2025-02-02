import React, { createContext, useState } from 'react';

import ConnectModal from '../containers/ConnectModal';
import { ContextState, IProviderConfig, ContextValues, IAppearance } from '../types';

export const ProviderContext = createContext<ContextState | null>(null);

export const defaultAppearance: IAppearance = {
  theme: 'light',
  background: '#FFFFFF',
  accent: '#0D1292CC',
  textColor: '#000000',
  font: 'PP Editorial Sans',
  cornerRadius: 'full',
  cover: '',
};

export const BluxProvider = ({
  config,
  appearance,
  children,
}: {
  appearance?: Partial<IAppearance>;
  config: IProviderConfig;
  children: React.ReactNode;
}) => {
  const mergedAppearance: IAppearance = {
    ...defaultAppearance,
    ...appearance,
  };

  const [value, setValue] = useState<ContextValues>({
    config,
    appearance: mergedAppearance,
    user: { wallet: null },
    openModal: false,
    ready: false,
    isDemo: false,
    isAuthenticated: false,
    isConnecting: false,
  });

  return (
    <ProviderContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      {children}
      <ConnectModal isOpen={value.openModal} />
    </ProviderContext.Provider>
  );
};
