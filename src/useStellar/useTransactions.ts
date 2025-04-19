import { useState, useEffect } from 'react';
import { Horizon } from '@stellar/stellar-sdk';

import useCheckProvider from '../hooks/useCheckProvider';
import useCustomNetwork from '../hooks/useCustomNetwork';

interface UseTransactionsProps<T extends boolean = false> {
  limit?: number;
  address?: string;
  network?: string;
  includeOperations?: T;
}

interface TransactionRecordWithOperations extends Omit<Horizon.ServerApi.TransactionRecord, 'operations'> {
  operations: Horizon.ServerApi.OperationRecord[] 
}

type TransactionRecord<T extends boolean> = T extends true
  ? TransactionRecordWithOperations
  : Horizon.ServerApi.TransactionRecord;

interface UseTransactionsResult<T extends boolean> {
  loading: boolean;
  error: Error | null;
  transactions: TransactionRecord<T>[] | null;
}

const useTransactions =  <T extends boolean = false>(params?: UseTransactionsProps<T>): UseTransactionsResult<T> => {
  const { value } = useCheckProvider();
  const { horizon, networkPassphrase } = useCustomNetwork(params?.network);

  const [result, setResult] = useState<UseTransactionsResult<T>>({
    error: null,
    loading: true,
    transactions: null
  });

  useEffect(() => {
    setResult({
      error: null,
      loading: true,
      transactions: null,
    });

    const userAddress = value.user.wallet?.address as string | undefined;

    if (!userAddress && !params?.address) {
      setResult({
        loading: false,
        transactions: null,
        error: new Error('Both user.wallet.address and address parameter are undefined'),
      });

      return;
    }

    const finalAddress = (!!params?.address ? params?.address : userAddress) as string;

    horizon
      .transactions()
      .forAccount(finalAddress)
      .limit(params?.limit || 5)
      .order('desc')
      .call()
      .then((txs) => {
        if (params?.includeOperations) {
          const operationsBuilder: Promise<
            Horizon.ServerApi.CollectionPage<Horizon.ServerApi.OperationRecord>
          >[] = [];

          for (const tx of txs.records) {
            operationsBuilder.push(tx.operations());
          }

          Promise.all(operationsBuilder).then((operations) => {
            const transactionsWithOps = txs.records.map((x, i) => ({
              ...x,
              operations: operations[i].records,
            }));

            setResult({
              error: null,
              loading: false,
              transactions: transactionsWithOps as TransactionRecord<T>[],
            });
          });
        } else {
          setResult({
            error: null,
            loading: false,
            transactions: txs.records as TransactionRecord<T>[],
          });
        }
      })
      .catch((err) => {
        setResult({
          error: err,
          loading: false,
          transactions: null,
        });
      });
  }, [params?.address, networkPassphrase, value.user.wallet]);

  return result;
};

export default useTransactions;
