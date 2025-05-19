import lobstr from '@lobstrco/signer-extension-api';

import {
  GetNetworkResult,
  SupportedWallets,
  WalletInterface,
} from '../../types';

export const lobstrConfig: WalletInterface = {
  name: SupportedWallets.Lobstr,
  website: 'https://lobstr.co',

  isAvailable: async () => {
    return await lobstr.isConnected();
  },

  connect: async () => {
    try {
      if (!(await lobstr.isConnected())) {
        throw new Error('LOBSTR Wallet is not installed or connected.');
      }

      const publicKey = await lobstr.getPublicKey();

      return { publicKey };
    } catch {
      throw new Error('Failed to connect to LOBSTR.');
    }
  },

  signTransaction: async (xdr: string): Promise<string> => {
    try {
      if (!lobstr.signTransaction) {
        throw new Error('LOBSTR Wallet does not support signing transactions.');
      }

      const result = await lobstr.signTransaction(xdr);

      return result;
    } catch {
      throw new Error('Failed to sign the transaction with LOBSTR.');
    }
  },
  getNetwork: async (): Promise<GetNetworkResult> => {
    throw new Error('Failed to get network from LOBSTR');
  },
};
