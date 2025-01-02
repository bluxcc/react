import albedo from '@albedo-link/intent';

import { SupportedWallets, WalletActions, WalletNetwork, networksEnum } from '../../types';

export const albedoConfig: WalletActions = {
  name: SupportedWallets.Albedo,
  website: 'https://albedo.link',
  isAvailable: async () => true,
  connect: async () => {
    const result = await albedo.publicKey({ token: 'Connect to Albedo' });
    return { publicKey: result.pubkey };
  },
  signTransaction: async (xdr: string, options = {}) => {
    const result = await albedo.tx({
      xdr,
      pubkey: options?.address,
      network:
        options.networkPassphrase === WalletNetwork.PUBLIC
          ? networksEnum.PUBLIC
          : networksEnum.TESTNET,
      submit: options?.submit,
    });
    return result.signed_envelope_xdr;
  },
};
