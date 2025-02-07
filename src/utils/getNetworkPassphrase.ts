import { WalletNetwork } from '../types';

export const getNetworkPassphrase = (network: string): string => {
  const normalizedNetwork = network.trim().toLowerCase();

  switch (normalizedNetwork) {
    case 'mainnet':
      return WalletNetwork.PUBLIC;
    case 'testnet':
      return WalletNetwork.TESTNET;
    case 'futurenet':
      return WalletNetwork.FUTURENET;
    case 'sandbox':
      return WalletNetwork.SANDBOX;
    case 'standalone':
      return WalletNetwork.STANDALONE;
    default:
      throw new Error(`Unknown network: ${network}`);
  }
};
