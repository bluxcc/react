import { xBullWalletConnect } from '@creit.tech/xbull-wallet-connect';

import getNetworkByPassphrase from '../../utils/stellar/getNetworkByPassphrase';
import {
  GetNetworkResult,
  SupportedWallets,
  WalletInterface,
} from '../../types';

export const xBullConfig: WalletInterface = {
  name: SupportedWallets.Xbull,
  website: 'https://xbull.app',

  isAvailable: () =>
    new Promise((resolve) => {
      setTimeout(
        () => resolve(typeof window !== 'undefined' && !!window.xBullSDK),
        250,
      );
    }),

  connect: async () => {
    try {
      const xbull = new xBullWalletConnect();

      const publicKey = await xbull.connect();

      xbull.closeConnections();

      return { publicKey };
    } catch (error) {
      throw new Error('Failed to connect to xBull.');
    }
  },

  signTransaction: async (xdr: string, options = {}): Promise<string> => {
    try {
      const xbull = new xBullWalletConnect();

      const signedXdr = await xbull.sign({
        xdr,
        publicKey: options?.address,
        network:
          options?.networkPassphrase &&
          getNetworkByPassphrase(options?.networkPassphrase),
      });

      xbull.closeConnections();

      return signedXdr;
    } catch (error) {
      throw new Error('Failed to sign the transaction with xBull.');
    }
  },
  getNetwork: async (): Promise<GetNetworkResult> => {
    throw new Error('Failed to get network from xBull');
  },
};
