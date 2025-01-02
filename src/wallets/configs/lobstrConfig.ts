import { isConnected, getPublicKey, signTransaction } from '@lobstrco/signer-extension-api';

import { SupportedWallets, WalletActions } from '../../types';

const isBrowser = typeof window !== 'undefined';

export const lobstrConfig: WalletActions = {
  name: SupportedWallets.Lobstr,
  website: 'https://lobstr.co',
  isAvailable: async () => isBrowser && !!(await isConnected()),
  connect: async () => {
    if (!(await isConnected())) {
      throw new Error('LOBSTR Wallet is not installed or connected.');
    }
    const publicKey = await getPublicKey();
    return { publicKey };
  },
  signTransaction: async (xdr: string) => {
    if (!signTransaction) {
      throw new Error('LOBSTR Wallet does not support signing transactions.');
    }
    return await signTransaction(xdr);
  },
};
