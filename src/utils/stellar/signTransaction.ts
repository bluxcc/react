import { WalletInterface } from '../../types';
import submitTransaction from './submitTransaction';

const signTransaction = async (
  wallet: WalletInterface,
  xdr: string,
  address: string,
  network: string,
) => {
  if (!wallet?.signTransaction) {
    throw new Error('Wallet does not support transaction signing.');
  }

  const signedXdr = await wallet.signTransaction(xdr, {
    networkPassphrase: network,
    address,
  });

  const result = await submitTransaction(signedXdr, network);

  return result;
};

export default signTransaction;
