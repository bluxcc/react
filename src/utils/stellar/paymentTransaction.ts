import {
  Memo,
  Asset,
  Horizon,
  Operation,
  TransactionBuilder,
} from '@stellar/stellar-sdk';

import { IAsset } from '../../types';

const paymentTransaction = async (
  memo: string,
  amount: string,
  destinationAddress: string,
  asset: IAsset,
  sourceAddress: string,
  server: Horizon.Server,
  networkPassphrase: string,
) => {
  let sourceAccount: null | Horizon.AccountResponse = null;
  let destinationAccount: null | Horizon.AccountResponse = null;

  try {
    destinationAccount = await server.loadAccount(destinationAddress);
  } catch { }

  try {
    sourceAccount = await server.loadAccount(sourceAddress);
  } catch { }

  if (!sourceAccount) {
    throw new Error('Inactive account cannot send a transaction.');
  }

  if (!destinationAccount && asset.assetType !== 'native') {
    throw new Error('Cannot send non-native asset to an inactive account.');
  }

  let transaction = new TransactionBuilder(sourceAccount, {
    fee: '50000',
    networkPassphrase,
  });

  if (!destinationAccount) {
    transaction = transaction.addOperation(
      Operation.createAccount({
        startingBalance: amount,
        destination: destinationAddress,
      }),
    );
  } else {
    let stellarAsset = Asset.native();

    if (asset.assetType !== 'native') {
      stellarAsset = new Asset(asset.assetCode, asset.assetIssuer);
    }

    transaction = transaction.addOperation(
      Operation.payment({
        amount,
        destination: destinationAddress,
        asset: stellarAsset,
      }),
    );
  }

  if (memo) {
    transaction = transaction.addMemo(Memo.text(memo));
  }

  const transactionEnvelope = transaction.setTimeout(180).build();

  return transactionEnvelope.toXDR();
};

export default paymentTransaction;
