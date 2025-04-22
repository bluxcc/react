import { Transaction, Operation } from '@stellar/stellar-sdk';

const getTransactionDetails = (xdr: string, network: string) => {
  try {
    const transaction = new Transaction(xdr, network);
    const firstOp = transaction.operations[0];

    let receiver: string | null = null;

    if (firstOp.type === 'payment') {
      receiver = (firstOp as Operation.Payment).destination;
    }

    return {
      action: firstOp.type,
      operations: transaction.operations.length,
      sender: transaction.source,
      receiver,
      estimatedFee: Number(transaction.fee) / 1e7,
    };
  } catch (error) {
    console.error('Failed to parse transaction XDR:', error);
    return null;
  }
};

export default getTransactionDetails;
