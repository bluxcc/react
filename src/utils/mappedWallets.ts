import { WalletInterface } from '../types';
import { walletsConfig } from '../wallets/walletsConfig';

export type MappedWallet = {
  wallet: WalletInterface;
  isAvailable: boolean;
};

const getMappedWallets = async (): Promise<MappedWallet[]> => {
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

export default getMappedWallets;
