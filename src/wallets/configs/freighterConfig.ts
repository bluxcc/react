import freighterApi, { signTransaction } from '@stellar/freighter-api';

import { SupportedWallets, WalletActions } from '../../types';

const isBrowser = typeof window !== 'undefined';

export const freighterConfig: WalletActions = {
  name: SupportedWallets.Freighter,
  website: 'https://freighter.app',
  isAvailable: async () => isBrowser && !!(await freighterApi.isConnected()),
  connect: async () => {
    if (!(await freighterApi.isConnected())) {
      throw new Error('Freighter Wallet is not installed or connected.');
    }
    const result = await freighterApi.requestAccess();
    return { publicKey: result.address };
  },
  signTransaction: async (xdr: string, options = {}) => {
    const result = await signTransaction(xdr, {
      address: options?.address,
      networkPassphrase: options?.networkPassphrase,
    });
    return result.signedTxXdr;
  },
};
