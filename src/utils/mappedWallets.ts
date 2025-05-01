import { CheckedWallet } from '../types';
import { walletsConfig } from '../wallets/walletsConfig';
import { getRecentConnectionMethod } from './setRecentConnectionMethod';

const getMappedWallets = async (): Promise<CheckedWallet[]> => {
  const recentConnectionMethod = getRecentConnectionMethod();

  return Promise.all(
    Object.values(walletsConfig).map(async (wallet): Promise<CheckedWallet> => {
      const isRecent = recentConnectionMethod === wallet.name;

      try {
        const isAvailable = await wallet.isAvailable();
        return { wallet, isAvailable, isRecent };
      } catch (_) {
        return { wallet, isAvailable: false, isRecent };
      }
    }),
  );
};

export default getMappedWallets;
