import { WalletNetwork } from '../../types';

const getNetworkByPassphrase = (passphrase: string) => {
  const networkEntry = Object.entries(WalletNetwork).find(
    ([, value]) => value === passphrase,
  );

  if (!networkEntry) {
    throw new Error(`Unknown network passphrase: ${passphrase}`);
  }

  return networkEntry[0].toLowerCase();
};

export default getNetworkByPassphrase;
