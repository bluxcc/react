import { WalletInterface } from "../types";

const setWalletNetwork = async (wallet: WalletInterface, networks: string[]) => {
  try {
    const { passphrase } = await wallet.getNetwork();

    return passphrase;
  } catch (e) {
    return networks[0];
  }
};

export default setWalletNetwork;
