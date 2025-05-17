import {
  WalletInterface,
  GetNetworkResult,
  SupportedWallets,
} from '../../types';

export const xBullConfig: WalletInterface = {
  name: SupportedWallets.Xbull,
  website: 'https://xbull.app',

  isAvailable: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(typeof window !== 'undefined' && !!window.xBullSDK);
      }, 250);
    }),

  connect: async () => {
    try {
      if (!window.xBullSDK) throw new Error('xBull Wallet is not installed.');

      await window.xBullSDK.connect({
        canRequestPublicKey: true,
        canRequestSign: true,
      });

      const publicKey = await window.xBullSDK.getPublicKey();

      return {
        publicKey,
      };
    } catch {
      throw new Error('Failed to connect to xBull.');
    }
  },

  signTransaction: async (xdr: string, options = {}): Promise<string> => {
    try {
      if (!window.xBullSDK) throw new Error('xBull Wallet is not installed.');

      const signedXdr = await window.xBullSDK.signXDR(xdr, {
        network: options.networkPassphrase,
        publicKey: options.address,
      });

      return signedXdr;
    } catch {
      throw new Error('Failed to sign the transaction with xBull.');
    }
  },
  getNetwork: async (): Promise<GetNetworkResult> => {
    try {
      if (!window.xBullSDK) throw new Error('xBull Wallet is not installed.');

      const networkDetails = await window.xBullSDK.getNetwork();

      return {
        network: networkDetails.network,
        passphrase: networkDetails.networkPassphrase,
      };
    } catch {
      throw new Error('Error getting network from Rabet:');
    }
  },
};
