import { useContext } from 'react';
import { ProviderContext } from '../context/provider';

export const useBlux = () => {
  const context = useContext(ProviderContext);

  if (!context) {
    throw new Error('useBlux must be used within a ProviderContext.');
  }

  const { value, setValue } = context;

  const connect = async () => {
    setValue({
      ...value,
      openModal: true,
    });
  };

  const disconnect = async () => {
    setValue({
      ...value,
      user: { wallet: null },
      openModal: false,
    });
  };

  const openDemo = () => {
    setValue({
      ...value,
      isDemo: true,
      openModal: true,
    });
  };

  return {
    connect,
    disconnect,
    openDemo,
    isReady: value?.ready || false,
    user: value?.user || null,
    isAuthenticated: value?.isAuthenticated || false,
  };
};
