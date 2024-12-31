import React, { useContext } from 'react';
import { SupportedWallets } from '../types';
import { walletConfigs } from './walletsConfig';
import { ProviderContext } from './provider';

const useBlux = () => {
  const context = useContext(ProviderContext);

  const connect = async () => {
    context?.setValue({
      ...context.value,
      modal: {
        isOpen: true,
      },
    });
  };
  const user = () => {
    return context?.value.user;
  };

  return { connect, user };
};

export default useBlux;
