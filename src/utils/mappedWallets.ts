import { WalletActions } from '../types';
import { walletsConfig } from '../wallets/walletsConfig';

export type MappedWallet = {
  wallet: WalletActions;
  isAvailable: boolean;
};

export const getMappedWallets = async (): Promise<MappedWallet[]> => {
  return Promise.all(
    Object.values(walletsConfig).map(async (wallet): Promise<MappedWallet> => {
      try {
        const isAvailable = await wallet.isAvailable();
        return { wallet, isAvailable };
      } catch (error) {
        console.error(`Error checking availability for ${wallet.name}:`, error);
        return { wallet, isAvailable: false };
      }
    }),
  );
};
