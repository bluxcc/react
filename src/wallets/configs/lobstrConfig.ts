import { isConnected, getPublicKey, signTransaction } from '@lobstrco/signer-extension-api';

import { SupportedWallets, WalletInterface } from '../../types';

export const lobstrConfig: WalletInterface = {
  name: SupportedWallets.Lobstr,
  website: 'https://lobstr.co',

  isAvailable: async () => true,

  connect: async () => {
    try {
      if (!(await isConnected())) {
        throw new Error('LOBSTR Wallet is not installed or connected.');
      }
      const publicKey = await getPublicKey();
      return { publicKey };
    } catch (error) {
      console.error('Error connecting to LOBSTR:', error);
      throw new Error('Failed to connect to LOBSTR.');
    }
  },

  signTransaction: async (xdr: string): Promise<string> => {
    try {
      if (!signTransaction) {
        throw new Error('LOBSTR Wallet does not support signing transactions.');
      }
      return await signTransaction(xdr);
    } catch (error) {
      console.error('Error signing transaction with LOBSTR:', error);
      throw new Error('Failed to sign the transaction with LOBSTR.');
    }
  },
};
