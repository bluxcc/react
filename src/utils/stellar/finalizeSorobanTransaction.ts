import { rpc } from "@stellar/stellar-sdk";

const timeout = (waiter: number) => new Promise((resolve) => setTimeout(resolve, waiter));

const finalizeSorobanTransaction = async (hash: string, server: rpc.Server) => {
  for (let i = 0; i < 15; ++i) {
    const tx = await server.getTransaction(hash);

    if (tx.status === 'SUCCESS') {
      return tx;
    }

    if (tx.status === 'FAILED') {
      break;
    }

    await timeout(1000);
  }

  return null;
};

export default finalizeSorobanTransaction;
