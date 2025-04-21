import { Horizon, rpc } from '@stellar/stellar-sdk';
import React, { createContext, useState, useEffect, useContext } from 'react';

import BluxModal from '../containers/BluxModal';
import { defaultLightTheme } from '../constants';
import getMappedWallets from '../utils/mappedWallets';
import NETWORKS_DETAILS from '../constants/networkDetails';
import getNetworkRpc from '../utils/network/getNetworkRpc';
import useCheckWalletNetwork from './useCheckWalletNetwork';
import initializeRabetMobile from '../utils/initializeRabetMobile';
import {
  Routes,
  ContextState,
  IProviderConfig,
  ContextInterface,
} from '../types';

export const ProviderContext = createContext<ContextState | null>(null);

type BluxProviderProps = {
  isDemo?: boolean;
  config: IProviderConfig;
  children: React.ReactNode | any;
};

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

  for (const n of config.networks) {
    if (!NETWORKS_DETAILS[n]) {
      if (!config.transports) {
        throw new Error('Must set transports for custom networks');
      } else if (!config.transports[n]) {
        throw new Error('Must set transports for custom networks');
      }
    }
  }

  const { horizon, soroban } = getNetworkRpc(
    config.defaultNetwork,
    config.transports ?? {},
  );

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
      options: {
        network: '',
        isSoroban: false,
      },
      result: null,
      rejecter: null,
      resolver: null,
    },
    availableWallets: [],
    servers: {
      horizon: new Horizon.Server(horizon.url),
      soroban: new rpc.Server(soroban.url),
    },
  });

  useCheckWalletNetwork(value, setValue, setRoute);

  useEffect(() => {
    setValue((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        appearance: {
          ...defaultLightTheme,
          ...config.appearance,
        },
      },
    }));
  }, [config]);

  useEffect(() => {
    const { horizon, soroban } = getNetworkRpc(
      value.activeNetwork,
      value.config.transports ?? {},
    );

    setValue((prev) => ({
      ...prev,
      servers: {
        horizon: new Horizon.Server(horizon.url),
        soroban: new rpc.Server(soroban.url),
      },
    }));
  }, [value.config.transports, value.config.networks, value.activeNetwork]);

  const loadWallets = () => {
    getMappedWallets().then((mappedWallets) => {
      const available = mappedWallets
        .filter((w) => w.isAvailable)
        .map((w) => w.wallet);

      setValue((prev) => ({
        ...prev,
        isReady: true,
        availableWallets: available,
      }));

      initializeRabetMobile();
    });
  };

  useEffect(() => {
    if (document.readyState === 'complete') {
      loadWallets();
    } else {
      window.addEventListener('load', loadWallets);
    }

    return () => {
      window.removeEventListener('load', loadWallets);
    };
  }, []);

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
