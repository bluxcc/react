import { Transaction } from '@stellar/stellar-sdk';

const getTransactionDetails = (xdr: string, network: string) => {
  try {
    const transaction = new Transaction(xdr, network);

    return {
      action: transaction.operations[0].type,
      operations: transaction.operations.length,
      sender: transaction.source,
      estimatedFee: Number(transaction.fee) / 10000000,
    };
  } catch (error) {
    console.error('Transaction failed:', error);

    return null;
  }
};

export default getTransactionDetails;
