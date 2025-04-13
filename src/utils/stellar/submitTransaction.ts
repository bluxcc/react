import { Horizon, Transaction } from '@stellar/stellar-sdk';

import { ITransports } from '../../types';
import getNetworkRpc from '../network/getNetworkRpc';

const submitTransaction = async (xdr: string, network: string, transports: ITransports) => {
  try {
    const { horizon } = getNetworkRpc(network, transports);

    if (!horizon) {
      throw new Error('Horizon RPC was not found.');
    }

    const server = new Horizon.Server(horizon.url);

    const transaction = new Transaction(xdr, network);

    const response = await server.submitTransaction(transaction);

    return response;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};
export default submitTransaction;
