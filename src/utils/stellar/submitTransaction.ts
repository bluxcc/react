import { Horizon, Transaction } from '@stellar/stellar-sdk';

const submitTransaction = async (xdr: string, network: string) => {
  try {
    const server = new Horizon.Server('https://horizon-testnet.stellar.org');

    const transaction = new Transaction(xdr, network);

    const response = await server.submitTransaction(transaction);

    return response;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};
export default submitTransaction;
