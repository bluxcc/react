import { CheckedWallet } from '../types';
import { walletsConfig } from '../wallets/walletsConfig';

const getMappedWallets = async (): Promise<CheckedWallet[]> => {
  return Promise.all(
    Object.values(walletsConfig).map(async (wallet): Promise<CheckedWallet> => {
      try {
        const isAvailable = await wallet.isAvailable();
        return { wallet, isAvailable };
      } catch (_) {
        return { wallet, isAvailable: false };
      }
    }),
  );
};

export default getMappedWallets;
