import React, { createContext, useState, useEffect, useContext } from 'react';

import BluxModal from '../containers/BluxModal';
import { defaultLightTheme } from '../constants';
import getMappedWallets from '../utils/mappedWallets';
import useCheckWalletNetwork from './useCheckWalletNetwork';
import initializeRabetMobile from '../utils/initializeRabetMobile';
import {
  ContextState,
  IProviderConfig,
  ContextInterface,
  Routes,
} from '../types';

export const ProviderContext = createContext<ContextState | null>(null);

type BluxProviderProps = {
  isDemo?: boolean;
  config: IProviderConfig;
  children: React.ReactNode | any;
};

// const getGoogleFontUrl = (fontName: string): string => {
//   const fallbackEncoded = fontName.trim().split(' ').join('+');
//   const encodedFont = fontName ?? fallbackEncoded;

//   return `https://fonts.googleapis.com/css2?family=${encodedFont}&display=swap`;
// };

export const BluxProvider = ({
  config,
  isDemo,
  children,
}: BluxProviderProps) => {
  if (config.networks.length === 0) {
    throw new Error('no network is set in config.networks');
  }

  if (!config.networks.includes(config.defaultNetwork)) {
    throw new Error('default network is not listed in networks');
  }

  const [route, setRoute] = useState<Routes>(Routes.ONBOARDING);
  const [value, setValue] = useState<ContextInterface>({
    config: {
      ...config,
      appearance: {
        ...defaultLightTheme,
        ...config.appearance,
      },
    },
    activeNetwork: config.defaultNetwork,
    isDemo: isDemo ?? false,
    user: { wallet: null, phoneNumber: null, email: null },
    isModalOpen: false,
    isReady: false,
    isAuthenticated: false,
    waitingStatus: 'connecting',
    signTransaction: {
      xdr: '',
      network: '',
      result: null,
      resolver: null,
    },
    availableWallets: [],
  });

  useCheckWalletNetwork(value, setValue, setRoute);

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        loginMethods: config.loginMethods,
        appearance: {
          ...defaultLightTheme,
          ...config.appearance,
        },
      },
    }));
  }, [config]);

  useEffect(() => {
    const loadWallets = async () => {
      const mappedWallets = await getMappedWallets();

      const handleLoad = () => initializeRabetMobile();
      window.addEventListener('load', handleLoad);

      const available = mappedWallets
        .filter(({ isAvailable }) => isAvailable)
        .map(({ wallet }) => wallet);

      setValue((prev) => ({
        ...prev,
        availableWallets: available,
        isReady: true,
      }));

      return () => {
        window.removeEventListener('load', handleLoad);
      };
    };

    loadWallets();
  }, []);

  // useEffect(() => {
  //   const font = value.config.appearance.font;

  //   if (!font) return;

  //   const existing = document.querySelector(`link[data-font="${font}"]`);
  //   if (existing) return;

  //   const link = document.createElement('link');
  //   link.href = getGoogleFontUrl(font);
  //   link.rel = 'stylesheet';
  //   link.setAttribute('data-font', font);
  //   document.head.appendChild(link);

  //   return () => {
  //     const addedFont = document.querySelector(`link[data-font="${font}"]`);
  //     if (addedFont) {
  //       document.head.removeChild(addedFont);
  //     }
  //   };
  // }, [value.config.appearance.font]);

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
