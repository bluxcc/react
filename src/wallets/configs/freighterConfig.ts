import freighterApi, { signTransaction } from '@stellar/freighter-api';

import {
  GetNetworkResult,
  SupportedWallets,
  WalletInterface,
} from '../../types';

export const freighterConfig: WalletInterface = {
  name: SupportedWallets.Freighter,
  website: 'https://freighter.app',

  isAvailable: () =>
    new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 400);

      setTimeout(() => {
        freighterApi
          .isConnected()
          .then(({ isConnected, error }) => {
            clearTimeout(timeout);

            resolve(!error && isConnected);
          })
          .catch(() => {
            clearTimeout(timeout);

            resolve(false);
          });
      }, 250);
    }),

  connect: async () => {
    try {
      if (!(await freighterApi.isConnected())) {
        throw new Error('Freighter Wallet is not installed or connected.');
      }

      const result = await freighterApi.requestAccess();

      if (
        result.error &&
        result.error.message === 'The user rejected this request.'
      ) {
        throw new Error('Failed to connect to Freighter');
      }

      if (result.address.trim() === '') {
        throw new Error('Failed to connect to Freighter.');
      }

      return { publicKey: result.address };
    } catch (error: any) {
      if (error.message === 'Failed to connect to Freighter.') {
        const res = await freighterConfig.connect();

        return res;
      }

      console.error('Error connecting to Freighter:', error);

      throw new Error('Failed to connect to Freighter.');
    }
  },

  signTransaction: async (xdr: string, options = {}): Promise<string> => {
    try {
      if (!(await freighterApi.isConnected())) {
        throw new Error('Freighter Wallet is not installed or connected.');
      }

      const result = await signTransaction(xdr, {
        address: options?.address,
        networkPassphrase: options?.networkPassphrase,
      });

      return result.signedTxXdr;
    } catch (error) {
      console.error('Error signing transaction with Freighter:', error);

      throw new Error('Failed to sign the transaction with Freighter.');
    }
  },
  getNetwork: async (): Promise<GetNetworkResult> => {
    try {
      if (!(await freighterApi.isConnected())) {
        throw new Error('Freighter Wallet is not installed or connected.');
      }

      const network = await freighterApi.getNetwork();

      if (network.error) {
        throw new Error('Failed to get network from Freighter');
      }

      return {
        network: network.network,
        passphrase: network.networkPassphrase,
      };
    } catch (error) {
      console.error('Error getting network from:', error);

      throw new Error('Failed to disconnect from Rabet.');
    }
  },
};
