import React, { createContext, useState, useEffect, useContext } from 'react';

import BluxModal from '../containers/BluxModal';
import { defaultAppearance } from '../constants';
import { ContextState, IProviderConfig, ContextInterface, IAppearance, Routes } from '../types';
import getMappedWallets from '../utils/mappedWallets';
import initializeRabetMobile from '../utils/initializeRabetMobile';

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
  if (config.networks.length === 0) {
    throw new Error('no network is set in config.networks');
  }

  const [route, setRoute] = useState<Routes>(Routes.ONBOARDING);
  const [value, setValue] = useState<ContextInterface>({
    config,
    appearance: appearance ?? defaultAppearance,
    isDemo: isDemo ?? false,
    user: { wallet: null, phoneNumber: null, email: null },
    isModalOpen: false,
    isReady: false,
    isAuthenticated: false,
    waitingStatus: 'connecting',
    signTransaction: {
      xdr: '',
      resolver: null,
      result: null,
    },
    availableWallets: [],
  });

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      appearance: appearance ?? defaultAppearance,
    }));
  }, [appearance]);

  useEffect(() => {
    const loadWallets = async () => {
      const mappedWallets = await getMappedWallets();
      window.addEventListener('load', initializeRabetMobile);
      const available = mappedWallets
        .filter(({ isAvailable }) => isAvailable)
        .map(({ wallet }) => wallet);

      setValue((prev) => ({
        ...prev,
        availableWallets: available,
        isReady: true,
      }));
    };

    loadWallets();
  }, [config]);

   useEffect(() => {
    if (value.user.wallet && !value.config.networks.includes(value.user.wallet.passphrase)) {
      // todo: use a persistent modal instead of alert
      console.log('You are on a wrong network!');
    } else {
      console.log('You are on a right network!');
      // close the modal if the network is correct.
    }
  }, [value.config.networks, value.user.wallet]);


  const closeModal = () => {
    setValue((prev) => ({
      ...prev,
      isModalOpen: false,
    }));
  };

  return (
    <ProviderContext.Provider value={{ value, setValue, route, setRoute }}>
      {children}

      <BluxModal isOpen={value.isModalOpen} closeModal={closeModal} />
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
