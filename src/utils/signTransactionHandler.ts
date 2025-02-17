import { HorizonApi } from '@stellar/stellar-sdk/lib/horizon';
import { WalletActions } from '../types';
import { submitTransaction } from './submitTransaction';

export const signTransactionHandler = async (
  wallet: WalletActions,
  xdr: string,
  address: string,
  networkPassphrase: string,
  resolver: ((value: HorizonApi.SubmitTransactionResponse) => void) | null,
) => {
  if (!wallet?.signTransaction) {
    throw new Error('Wallet does not support transaction signing.');
  }

  const signedXdr = await wallet.signTransaction(xdr, {
    networkPassphrase,
    address,
  });

  const result = await submitTransaction(signedXdr, networkPassphrase);

  if (resolver) resolver(result);
  return result;
};
