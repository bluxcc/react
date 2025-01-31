import { walletsConfig } from '../wallets/walletsConfig';

export const mappedWallets = await Promise.all(
  Object.values(walletsConfig).map(async (wallet) => {
    try {
      const isAvailable = await wallet.isAvailable();
      return { wallet, isAvailable };
    } catch (error) {
      console.error(`Error checking availability for ${wallet.name}:`, error);
      return { wallet, isAvailable: false };
    }
  }),
);
