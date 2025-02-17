import { WalletNetwork } from '../types';

export const getNetworkByPassphrase = (passphrase: string): WalletNetwork => {
  const networkEntry = Object.entries(WalletNetwork).find(([, value]) => value === passphrase);

  if (!networkEntry) {
    throw new Error(`Unknown network passphrase: ${passphrase}`);
  }

  return networkEntry[0].toLowerCase() as WalletNetwork;
};
