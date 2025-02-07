import { WalletNetwork } from '../types';

export const getNetworkByPassphrase = (passphrase: string): WalletNetwork => {
  const network = Object.values(WalletNetwork).find((n) => n === passphrase);
  if (!network) {
    throw new Error(`Unknown network passphrase: ${passphrase}`);
  }
  return network;
};
