import { SupportedWallets, WalletActions, WalletNetwork, networksEnum } from '../../types';

const isBrowser = typeof window !== 'undefined';

export const rabetConfig: WalletActions = {
  name: SupportedWallets.Rabet,
  website: 'https://rabet.io',
  isAvailable: async () => isBrowser && !!window.rabet,
  connect: async () => {
    if (!window.rabet) throw new Error('Rabet Wallet is not installed.');
    const result = await window.rabet.connect();
    return { publicKey: result.publicKey };
  },
  signTransaction: async (xdr: string, options = {}) => {
    if (!window.rabet) throw new Error('Rabet Wallet is not installed.');
    const result = await window.rabet.sign(
      xdr,
      options.networkPassphrase === WalletNetwork.PUBLIC
        ? networksEnum.PUBLIC
        : networksEnum.TESTNET,
    );
    return result.signedXdr;
  },
  disconnect: async () => {
    if (!window.rabet) throw new Error('Rabet Wallet is not installed.');
    window.rabet.disconnect();
  },
};
