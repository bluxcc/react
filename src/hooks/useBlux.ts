import { useContext } from 'react';
import { ProviderContext } from '../context/provider';

export const useBlux = () => {
  const context = useContext(ProviderContext);

  if (!context) {
    throw new Error('useBlux must be used within a ProviderContext.');
  }

  const { value, setValue } = context;

  const connect = () => {
    setValue((prev) => {
      if (prev.openModal) {
        return prev;
      }
      return { ...prev, openModal: true };
    });
  };

  const disconnect = () => {
    setValue({
      ...value,
      user: { wallet: null },
      openModal: false,
      isConnecting: false,
      isAuthenticated: false,
    });
  };

  const profile = () => {
    if (context?.value.isAuthenticated) {
      setValue({
        ...value,
        openModal: true,
      });
    } else {
      throw new Error('user is not authenticated');
    }
  };

  return {
    connect,
    disconnect,
    profile,
    isReady: value?.isReady || false,
    user: value?.user || null,
    isAuthenticated: value?.isAuthenticated || false,
  };
};
