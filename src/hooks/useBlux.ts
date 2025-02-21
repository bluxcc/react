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
    if (!isAuthenticated) {
      setValue((prev) => (prev.isModalOpen ? prev : { ...prev, isModalOpen: true }));
    } else {
      throw new Error('User is already connected.');
    }
  };

  const disconnect = () => {
    setValue((prev) => ({
      ...prev,
      user: { wallet: null },
      isModalOpen: false,
      isAuthenticated: false,
    }));
    setRoute(Routes.ONBOARDING);
  };

  const profile = () => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated.');
    }
    setRoute(Routes.PROFILE);
    setValue((prev) => ({ ...prev, isModalOpen: true }));
  };

  const signTransaction = (xdr: string) =>
    new Promise((resolve, reject) => {
      if (!isAuthenticated) {
        reject(new Error('User is not authenticated.'));
      }
      setRoute(Routes.SIGN_TRANSACTION);
      setValue((prev) => ({
        ...prev,
        isModalOpen: true,
        signTransaction: {
          ...prev.signTransaction,
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
