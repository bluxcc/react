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
      modal: { isOpen: true },
    });
  };

  const disconnect = async () => {
    setValue({
      ...value,
      user: { wallet: null },
      modal: { isOpen: false },
    });
  };

  const show = () => {
    setValue({
      ...value,
      modal: { isOpen: true },
    });
  };

  const hide = () => {
    setValue({
      ...value,
      modal: { isOpen: false },
    });
  };

  return {
    connect,
    disconnect,
    show,
    hide,
    isReady: value?.ready || false,
    user: value?.user || null,
    isAuthenticated: value?.isAuthenticated || false,
  };
};
