import { useProvider } from '../context/provider';
import { Routes } from '../types';

export const useBlux = () => {
  const context = useProvider();
  if (!context) {
    throw new Error('useBlux must be used within a ProviderContext.');
  }

  const { value, setValue, setRoute } = context;
  const { isAuthenticated, user } = value;

  const connect = () => {
    setValue((prev) => (prev.openModal ? prev : { ...prev, openModal: true }));
  };

  const disconnect = () => {
    setValue((prev) => ({
      ...prev,
      user: { wallet: null },
      openModal: false,
      isAuthenticated: false,
    }));
  };

  const profile = () => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated.');
    }
    setRoute(Routes.PROFILE);
    setValue((prev) => ({ ...prev, openModal: true }));
  };

  const signTransaction = (xdr: string) =>
    new Promise((resolve, reject) => {
      if (!isAuthenticated) {
        reject(new Error('User is not authenticated.'));
      }
      setRoute(Routes.SIGN_TRANSACTION);
      setValue((prev) => ({
        ...prev,
        openModal: true,
        signTransaction: {
          xdr,
          resolver: resolve,
        },
      }));
    });

  return {
    connect,
    disconnect,
    profile,
    signTransaction,
    isReady: value.isReady ?? false,
    user: user ?? null,
    isAuthenticated: isAuthenticated ?? false,
  };
};
