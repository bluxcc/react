import { xBullWalletConnect } from '@creit.tech/xbull-wallet-connect';
import { SupportedWallets, WalletActions } from '../../types';

export const xBullConfig: WalletActions = {
  name: SupportedWallets.Xbull,
  website: 'https://xbull.app',
  isAvailable: async () => true,
  connect: async () => {
    const bridge = new xBullWalletConnect();
    const publicKey = await bridge.connect();
    bridge.closeConnections();
    return { publicKey };
  },
  signTransaction: async (xdr: string, options = {}) => {
    const bridge = new xBullWalletConnect();
    const signedXdr = await bridge.sign({
      xdr,
      publicKey: options?.address,
      network: options?.networkPassphrase,
    });
    bridge.closeConnections();
    return signedXdr;
  },
};
