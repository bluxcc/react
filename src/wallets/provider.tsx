import { createContext, useState } from 'react';
import ChooseWallet from '../containers/ChooseWallet';

interface IProviderConfig {
  appName: string;
  networkPassphrase: string;
}

export interface IUser {
  address: string;
}

interface MergeConfigs {
  config: IProviderConfig;
  user: IUser | null;
  modal: {
    isOpen: boolean;
  };
}

interface StateValue {
  value: MergeConfigs;
  setValue: React.Dispatch<React.SetStateAction<MergeConfigs>>;
}

export const ProviderContext = createContext<StateValue | null>(null);

const BluxProvider = ({
  config,
  children,
}: {
  config: IProviderConfig;
  children: React.ReactNode;
}) => {
  const [value, setValue] = useState<MergeConfigs>({
    config,
    user: null,
    modal: {
      isOpen: false,
    },
  });

  return (
    <ProviderContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      {children}
      <ChooseWallet isOpen={value.modal.isOpen} />
    </ProviderContext.Provider>
  );
};

export default BluxProvider;
