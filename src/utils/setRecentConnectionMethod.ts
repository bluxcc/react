import { SupportedWallets } from '../types';
import { RECENT_CONNECTION_METHODS } from '../constants/storageKeys';

export const setRecentConnectionMethod = (walletName: SupportedWallets) => {
  const recentMethods = getRecentConnectionMethod();

  const newRecent = [
    walletName,
    ...recentMethods.filter((x) => x !== walletName),
  ];

  localStorage.setItem(RECENT_CONNECTION_METHODS, JSON.stringify(newRecent));
};

export const getRecentConnectionMethod = () => {
  const walletName = localStorage.getItem(RECENT_CONNECTION_METHODS);

  if (!walletName) {
    return [];
  }

  try {
    const result = JSON.parse(walletName) as SupportedWallets[];

    return result;
  } catch (_) {
    return [];
  }
};
