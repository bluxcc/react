import { Routes } from '../types';
import { useProvider } from '../context/provider';
import getTransactionDetails from '../utils/stellar/getTransactionDetails';

export const useBlux = () => {
  const context = useProvider();

  if (!context) {
    throw new Error('useBlux must be used within a ProviderContext.');
  }

  const { value, setValue, setRoute } = context;
  const { isReady, user, isAuthenticated } = value;

  const login = () => {
    if (!isReady) {
      throw new Error('Cannot connect when isReady is false.');
    }

    if (!isAuthenticated) {
      setValue((prev) =>
        prev.isModalOpen ? prev : { ...prev, isModalOpen: true },
      );
    } else {
      throw new Error('Already connected.');
    }
  };

  const logout = () => {
    setValue((prev) => ({
      ...prev,
      user: { ...prev.user, wallet: null },
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

  const sendTransaction = (xdr: string) =>
    new Promise((resolve, reject) => {
      if (!isAuthenticated) {
        reject(new Error('User is not authenticated.'));
      }

      if (!getTransactionDetails(xdr)) {
        reject('Invalid XDR');

        return;
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
    login,
    logout,
    profile,
    sendTransaction,
    user: user ?? null,
    isReady: value.isReady ?? false,
    isAuthenticated: isAuthenticated ?? false,
  };
};
