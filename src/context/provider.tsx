import React, { createContext, useState } from 'react';
import ConnectModal from '../containers/ConnectModal';
import { ContextState, IProviderConfig, ContextValues } from '../types';

export const ProviderContext = createContext<ContextState | null>(null);

export const BluxProvider = ({
  config,
  children,
}: {
  config: IProviderConfig;
  children: React.ReactNode;
}) => {
  const [value, setValue] = useState<ContextValues>({
    config,
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
