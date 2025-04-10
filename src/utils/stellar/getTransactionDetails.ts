import { Transaction } from '@stellar/stellar-sdk';
import { WalletNetwork } from '../../types';

const getTransactionDetails = (xdr: string) => {
  try {
    const transaction = new Transaction(xdr, WalletNetwork.PUBLIC);

    return {
      action: transaction.operations[0].type,
      operations: transaction.operations.length,
      sender: transaction.source,
      estimatedFee: Number(transaction.fee) / 1000000,
    };
  } catch (error) {
    console.error('Transaction failed:', error);

    return null;
  }
};

export default getTransactionDetails;
