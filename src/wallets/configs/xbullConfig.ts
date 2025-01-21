import { xBullWalletConnect } from '@creit.tech/xbull-wallet-connect';
import { SupportedWallets, WalletActions } from '../../types';

export const xBullConfig: WalletActions = {
  name: SupportedWallets.Xbull,
  website: 'https://xbull.app',

  isAvailable: () => typeof window !== 'undefined' && window.xBullSDK,

  connect: async () => {
    try {
      const bridge = new xBullWalletConnect();
      const publicKey = await bridge.connect();
      bridge.closeConnections();
      return { publicKey };
    } catch (error) {
      console.error('Error connecting to xBull:', error);
      throw new Error('Failed to connect to xBull.');
    }
  },

  signTransaction: async (xdr: string, options = {}): Promise<string> => {
    try {
      const bridge = new xBullWalletConnect();
      const signedXdr = await bridge.sign({
        xdr,
        publicKey: options?.address,
        network: options?.networkPassphrase,
      });
      bridge.closeConnections();
      return signedXdr;
    } catch (error) {
      console.error('Error signing transaction with xBull:', error);
      throw new Error('Failed to sign the transaction with xBull.');
    }
  },
};
