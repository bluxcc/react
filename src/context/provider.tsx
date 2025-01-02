import React, { createContext, useState } from 'react';
import ChooseWallet from '../containers/ChooseWallet';
import { StateValue, IProviderConfig, MergeConfigs } from '../types';

export const ProviderContext = createContext<StateValue | null>(null);

export const BluxProvider = ({
  config,
  children,
}: {
  config: IProviderConfig;
  children: React.ReactNode;
}) => {
  const [value, setValue] = useState<MergeConfigs>({
    config,
    user: { address: null },
    modal: { isOpen: true },
  });

  const closeModal = () => {
    setValue((prev) => ({
      ...prev,
      modal: { isOpen: false },
    }));
  };

  return (
    <ProviderContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      {children}
      <ChooseWallet isOpen={value.modal.isOpen} closeModal={closeModal} />
    </ProviderContext.Provider>
  );
};
