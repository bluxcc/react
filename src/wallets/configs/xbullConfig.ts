import { xBullWalletConnect } from '@creit.tech/xbull-wallet-connect';

import { SupportedWallets, WalletInterface } from '../../types';
import getNetworkByPassphrase from '../../utils/stellar/getNetworkByPassphrase';

export const xBullConfig: WalletInterface = {
  name: SupportedWallets.Xbull,
  website: 'https://xbull.app',

  isAvailable: () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(typeof window !== 'undefined' && !!window.xBullSDK), 250);
    }),

  connect: async () => {
    try {
      const xbull = new xBullWalletConnect();
      const publicKey = await xbull.connect();
      xbull.closeConnections();
      return { publicKey };
    } catch (error) {
      console.error('Error connecting to xBull:', error);
      throw new Error('Failed to connect to xBull.');
    }
  },

  signTransaction: async (xdr: string, options = {}): Promise<string> => {
    try {
      const xbull = new xBullWalletConnect();
      const signedXdr = await xbull.sign({
        xdr,
        publicKey: options?.address,
        network: options?.networkPassphrase && getNetworkByPassphrase(options?.networkPassphrase),
      });
      xbull.closeConnections();
      return signedXdr;
    } catch (error) {
      console.error('Error signing transaction with xBull:', error);
      throw new Error('Failed to sign the transaction with xBull.');
    }
  },
};
