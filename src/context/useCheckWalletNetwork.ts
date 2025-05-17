import { useEffect, useState } from 'react';

import { ContextInterface, Routes } from '../types';
import { walletsConfig } from '../wallets/walletsConfig';
import getWalletNetwork from '../utils/getWalletNetwork';

const useCheckWalletNetwork = (
  value: ContextInterface,
  setValue: React.Dispatch<React.SetStateAction<ContextInterface>>,
  setRoute: React.Dispatch<React.SetStateAction<Routes>>,
) => {
  const [shouldModalOpen, setShouldModalOpen] = useState(false);

  useEffect(() => {
    const i = setInterval(() => {
      if (!value.isAuthenticated || !value.user.wallet) {
        return;
      }

      getWalletNetwork(walletsConfig[value.user.wallet.name]).then(
        (networkPassphrase) => {
          if (
            networkPassphrase &&
            !value.config.networks.includes(networkPassphrase)
          ) {
            setShouldModalOpen(true);
          } else {
            setShouldModalOpen(false);
          }
        },
      );
    }, 500);

    return () => {
      clearInterval(i);

      setShouldModalOpen(false);
    };
  }, [value.isAuthenticated, value.config.networks, value.user.wallet]);

  useEffect(() => {
    if (shouldModalOpen) {
      setRoute(Routes.WRONG_NETWORK);

      setValue((prev) => ({ ...prev, isModalOpen: true }));
    } else {
      setValue((prev) => ({ ...prev, isModalOpen: false }));
    }
  }, [shouldModalOpen]);
};

export default useCheckWalletNetwork;
