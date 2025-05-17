import {
  GetNetworkResult,
  SupportedWallets,
  WalletInterface,
} from '../../types';

export const HanaConfig: WalletInterface = {
  name: SupportedWallets.Hana,
  website: 'https://www.hanawallet.io/',

  isAvailable: () => {
    return typeof window !== 'undefined' && !!window.hanaWallet?.stellar;
  },

  connect: async () => {
    try {
      if (!(await window.hanaWallet!.stellar!.getPublicKey())) {
        throw new Error('Hana Wallet is not installed or connected.');
      }

      const publicKey = await window.hanaWallet!.stellar!.getPublicKey();

      return { publicKey };
    } catch (error) {
      throw new Error('Failed to connect to Hana wallet.');
    }
  },

  signTransaction: async (
    xdr: string,
    options: { address?: string; networkPassphrase?: string } = {},
  ): Promise<string> => {
    try {
      const signFn = window?.hanaWallet?.stellar?.signTransaction;
      if (typeof signFn !== 'function') {
        throw new Error('Hana Wallet does not support signing transactions.');
      }

      return await signFn({
        xdr,
        address: options.address,
        networkPassphrase: options.networkPassphrase,
      });
    } catch (error) {
      throw new Error('Failed to sign the transaction with Hana wallet.');
    }
  },
  getNetwork: async (): Promise<GetNetworkResult> => {
    try {
      if (!window.hanaWallet?.stellar)
        throw new Error('Hana Wallet is not installed.');

      const networkDetails =
        await window.hanaWallet.stellar.getNetworkDetails();

      return {
        network: networkDetails.network,
        passphrase: networkDetails.networkPassphrase,
      };
    } catch {
      throw new Error('Error getting network from Rabet:');
    }
  },
};
