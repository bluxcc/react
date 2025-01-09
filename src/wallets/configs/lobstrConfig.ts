import * as lobstrApi from '@lobstrco/signer-extension-api';

import { SupportedWallets, WalletActions } from '../../types';

const isBrowser = typeof window !== 'undefined';

export const lobstrConfig: WalletActions = {
  name: SupportedWallets.Lobstr,
  website: 'https://lobstr.co',
  isAvailable: async () => isBrowser && !!(await lobstrApi.isConnected()),
  connect: async () => {
    if (!(await lobstrApi.isConnected())) {
      throw new Error('LOBSTR Wallet is not installed or connected.');
    }
    const publicKey = await lobstrApi.getPublicKey();
    return { publicKey };
  },
  signTransaction: async (xdr: string) => {
    if (!lobstrApi.signTransaction) {
      throw new Error('LOBSTR Wallet does not support signing transactions.');
    }
    return await lobstrApi.signTransaction(xdr);
  },
};
