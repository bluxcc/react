import { Transaction } from '@stellar/stellar-sdk';

export const getTransactionDetails = (xdr: string, networkPassPhrase: string) => {
  try {
    const transaction = new Transaction(xdr, networkPassPhrase);

    return {
      action: transaction.operations[0].type,
      operations: transaction.operations.length,
      sender: transaction.source,
      estimatedFee: Number(transaction.fee) / 1000000,
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};
