import { useContext } from 'react';
import { ProviderContext } from '../context/provider';

export const useBlux = () => {
  const context = useContext(ProviderContext);

  if (!context) {
    throw new Error('useBlux must be used within a ProviderContext.');
  }

  const { value, setValue } = context;

  const connect = async () => {
    setValue((prev) => {
      if (prev.openModal) {
        return prev;
      }
      return { ...prev, openModal: true };
    });
  };

  const disconnect = async () => {
    setValue({
      ...value,
      user: { wallet: null },
      openModal: false,
      isConnecting: false,
      isAuthenticated: false,
    });
  };

  return {
    connect,
    disconnect,
    isReady: value?.isReady || false,
    user: value?.user || null,
    isAuthenticated: value?.isAuthenticated || false,
  };
};
