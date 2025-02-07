import { SupportedWallets, WalletActions, WalletNetwork } from '../../types';

export const rabetConfig: WalletActions = {
  name: SupportedWallets.Rabet,
  website: 'https://rabet.io',

  isAvailable: () => typeof window !== 'undefined' && !!window.rabet,

  connect: async () => {
    try {
      if (!window.rabet) throw new Error('Rabet Wallet is not installed.');
      const result = await window.rabet.connect();
      return { publicKey: result.publicKey };
    } catch (error) {
      console.error('Error connecting to Rabet:', error);
      throw new Error('Failed to connect to Rabet.');
    }
  },

  signTransaction: async (xdr: string, options = {}): Promise<string> => {
    try {
      if (!window.rabet) throw new Error('Rabet Wallet is not installed.');
      const result = await window.rabet.sign(
        xdr,
        options.networkPassphrase === WalletNetwork.PUBLIC ? 'mainnet' : 'testnet',
      );
      return result.signedXdr;
    } catch (error) {
      console.error('Error signing transaction with Rabet:', error);
      throw new Error('Failed to sign the transaction with Rabet.');
    }
  },

  disconnect: async () => {
    try {
      if (!window.rabet) throw new Error('Rabet Wallet is not installed.');
      window.rabet.disconnect();
    } catch (error) {
      console.error('Error disconnecting from Rabet:', error);
      throw new Error('Failed to disconnect from Rabet.');
    }
  },
};
