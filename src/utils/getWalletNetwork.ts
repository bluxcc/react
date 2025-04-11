import { WalletInterface } from '../types';

const getWalletNetwork = async (wallet: WalletInterface) => {
  try {
    const { passphrase } = await wallet.getNetwork();

    return passphrase;
  } catch (e) {
    return '';
  }
};

export default getWalletNetwork;
