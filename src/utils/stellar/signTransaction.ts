import { WalletInterface } from '../../types';
import submitTransaction from './submitTransaction';

const signTransaction = async (
  wallet: WalletInterface,
  xdr: string,
  address: string,
  networkPassphrase: string,
) => {
  if (!wallet?.signTransaction) {
    throw new Error('Wallet does not support transaction signing.');
  }

  const signedXdr = await wallet.signTransaction(xdr, {
    networkPassphrase,
    address,
  });

  const result = await submitTransaction(signedXdr, networkPassphrase);

  return result;
};

export default signTransaction;
