import { useState, useEffect } from 'react';
import { Horizon } from '@stellar/stellar-sdk';

import useCheckProvider from '../hooks/useCheckProvider';
import useCustomNetwork from '../hooks/useCustomNetwork';

interface UseTransactionsProps {
  address?: string;
  network?: string;
}

interface UseTransactionsResult {
  loading: boolean;
  error: Error | null;
  transactions: Horizon.ServerApi.CollectionPage<Horizon.ServerApi.TransactionRecord> | null;
}

const useTransactions = (params?: UseTransactionsProps): UseTransactionsResult => {
  const { value } = useCheckProvider();
  const { horizon } = useCustomNetwork(params?.network);

  const [result, setResult] = useState<UseTransactionsResult>({
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
      .limit(5)
      .order('desc')
      .call()
      .then((txs) => {
        setResult({
          error: null,
          loading: false,
          transactions: txs,
        });
      })
      .catch((err) => {
        setResult({
          error: err,
          loading: false,
          transactions: null,
        });
      });
  }, [params?.address, params?.network, value.user.wallet]);

  return result;
};

export default useTransactions;
