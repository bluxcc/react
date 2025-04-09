import { Horizon } from '@stellar/stellar-sdk';
//
// Todo: fix all of this file
export type History = {
  title: string;
  description: string;
  others?: any;
};

// todo: remove any
const handleAssetText = (op: Horizon.ServerApi.PaymentOperationRecord | any) => {
  if (op.asset_type === 'native') {
    return 'XLM';
  }
  return op.asset_code;
};

export const getTransactions = async (server: Horizon.Server, publicKey: string) => {
  try {
    const transactionsPage = await server
      .transactions()
      .forAccount(publicKey)
      .limit(5)
      .order('desc')
      .call();

    const operationsBuilder: Promise<
      Horizon.ServerApi.CollectionPage<Horizon.ServerApi.OperationRecord>
    >[] = [];

    for (const tx of transactionsPage.records) {
      const ops = tx.operations();
      operationsBuilder.push(ops);
    }

    const operationsResult = await Promise.all(operationsBuilder);

    const result: History[] = [];

    for (const ops of operationsResult) {
      const op = ops.records[0];
      if (ops.records.length > 1) {
        result.push({
          title: 'Multi Operation',
          description: 'Multi Operation',
        });
      } else if (op.type === 'payment') {
        let title = 'Send';

        if (op.to.toLowerCase() === publicKey.toLowerCase()) {
          title = 'Receive';
        }

        result.push({
          title,
          description: `${op.amount} ${handleAssetText(op)}`,
        });

        // todo: use good operation types
      } else if (op.type === Horizon.HorizonApi.OperationResponseType.createAccount) {
        result.push({
          title: 'Create Account',
          description: 'Account creation',
        });
      } else if (
        op.type === Horizon.HorizonApi.OperationResponseType.pathPaymentStrictSend ||
        op.type === Horizon.HorizonApi.OperationResponseType.pathPayment
      ) {
        result.push({
          title: 'Swap',
          description: `Path payment of ${op.amount} ${handleAssetText(op)}`,
        });
      } else {
        result.push({
          title: 'Unknown Operation',
          description: 'Unknown transaction operation',
        });
      }
    }

    return result;
  } catch (error: unknown) {
    console.error(error);

    return [];
  }
};
