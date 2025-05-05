import { Horizon, rpc, Transaction } from '@stellar/stellar-sdk';

import getNetworkRpc from '../network/getNetworkRpc';
import finalizeSorobanTransaction from './finalizeSorobanTransaction';
import { ISendTransactionOptionsInternal, ITransports } from '../../types';

async function submitTransaction(
  xdr: string,
  options: ISendTransactionOptionsInternal & { isSoroban: true },
  transports: ITransports,
): Promise<rpc.Api.GetSuccessfulTransactionResponse>;

async function submitTransaction(
  xdr: string,
  options: ISendTransactionOptionsInternal & { isSoroban?: false },
  transports: ITransports,
): Promise<Horizon.HorizonApi.SubmitTransactionResponse>;

async function submitTransaction(
  xdr: string,
  options: ISendTransactionOptionsInternal,
  transports: ITransports,
): Promise<
  | rpc.Api.GetSuccessfulTransactionResponse
  | Horizon.HorizonApi.SubmitTransactionResponse
>;

async function submitTransaction(
  xdr: string,
  options: ISendTransactionOptionsInternal,
  transports: ITransports,
): Promise<
  | rpc.Api.GetSuccessfulTransactionResponse
  | Horizon.HorizonApi.SubmitTransactionResponse
> {
  const { horizon, soroban } = getNetworkRpc(options.network, transports);
  if (!horizon) {
    throw new Error('Horizon RPC was not found.');
  }
  const server = new Horizon.Server(horizon.url);

  const transaction = new Transaction(xdr, options.network);

  if (options.isSoroban) {
    const sorobanServer = new rpc.Server(soroban.url);
    const tx = await sorobanServer.sendTransaction(transaction);
    const finalize = await finalizeSorobanTransaction(tx.hash, sorobanServer);

    return finalize as rpc.Api.GetSuccessfulTransactionResponse;
  } else {
    const response = await server.submitTransaction(transaction);

    return response as Horizon.HorizonApi.SubmitTransactionResponse;
  }
}

export default submitTransaction;
