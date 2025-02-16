import { Horizon, Transaction } from '@stellar/stellar-sdk';

export const submitTransaction = async (xdr: string, networkPassPhrase: string) => {
  try {
    const server = new Horizon.Server('https://horizon-testnet.stellar.org');

    const transaction = new Transaction(xdr, networkPassPhrase);

    const response = await server.submitTransaction(transaction);

    return response;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};
