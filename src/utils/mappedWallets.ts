import { WalletInterface } from '../types';
import { walletsConfig } from '../wallets/walletsConfig';

export type MappedWallet = {
  wallet: WalletInterface;
  isAvailable: boolean;
};

const getMappedWallets = async (): Promise<MappedWallet[]> => Promise.all(
  Object.values(walletsConfig).map(async (wallet): Promise<MappedWallet> => {
    try {
      const isAvailable = await wallet.isAvailable();
      return { wallet, isAvailable };
    } catch (error) {
      return { wallet, isAvailable: false };
    }
  }),
);

export default getMappedWallets;
