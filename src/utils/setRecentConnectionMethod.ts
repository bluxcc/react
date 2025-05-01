import { SupportedWallets } from '../types';
import { RECENT_CONNECTION_METHOD } from '../constants/storageKeys';

export const setRecentConnectionMethod = (walletName: SupportedWallets) => {
  localStorage.setItem(RECENT_CONNECTION_METHOD, walletName);
};

export const getRecentConnectionMethod = () => {
  const walletName = localStorage.getItem(
    RECENT_CONNECTION_METHOD,
  ) as SupportedWallets | null;

  return walletName;
};
