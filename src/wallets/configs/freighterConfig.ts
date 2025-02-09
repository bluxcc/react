import freighterApi, { signTransaction } from '@stellar/freighter-api';
import { SupportedWallets, WalletActions } from '../../types';

export const freighterConfig: WalletActions = {
  name: SupportedWallets.Freighter,
  website: 'https://freighter.app',

  isAvailable: () =>
    new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 250);
      freighterApi
        .isConnected()
        .then(({ isConnected, error }) => {
          clearTimeout(timeout);
          resolve(!error && isConnected);
        })
        .catch(() => {
          clearTimeout(timeout);
          resolve(false);
        });
    }),

  connect: async () => {
    try {
      if (!(await freighterApi.isConnected())) {
        throw new Error('Freighter Wallet is not installed or connected.');
      }
      const result = await freighterApi.requestAccess();
      return { publicKey: result.address };
    } catch (error) {
      console.error('Error connecting to Freighter:', error);
      throw new Error('Failed to connect to Freighter.');
    }
  },

  signTransaction: async (xdr: string, options = {}): Promise<string> => {
    try {
      const result = await signTransaction(xdr, {
        address: options?.address,
        networkPassphrase: options?.networkPassphrase,
      });
      return result.signedTxXdr;
    } catch (error) {
      console.error('Error signing transaction with Freighter:', error);
      throw new Error('Failed to sign the transaction with Freighter.');
    }
  },
};
