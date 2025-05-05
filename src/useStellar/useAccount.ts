import { useState, useEffect } from 'react';
import { Horizon } from '@stellar/stellar-sdk';

import useCheckProvider from '../hooks/useCheckProvider';
import useCustomNetwork from '../hooks/useCustomNetwork';

interface UseAccountProps {
  address?: string;
  network?: string;
}

interface UseAccountResult {
  loading: boolean;
  error: Error | null;
  account: Horizon.AccountResponse | null;
}

const useAccount = (params?: UseAccountProps): UseAccountResult => {
  const { value } = useCheckProvider();
  const { horizon, networkPassphrase } = useCustomNetwork(params?.network);

  const [result, setResult] = useState<UseAccountResult>({
    error: null,
    loading: true,
    account: null
  });

  useEffect(() => {
    setResult({
      error: null,
      account: null,
      loading: true,
    });

    const userAddress = value.user.wallet?.address as string | undefined;

    if (!userAddress && !params?.address) {
      setResult({
        account: null,
        loading: false,
        error: new Error('Both user.wallet.address and address parameter are undefined'),
      });

      return;
    }

    const finalAddress = (params?.address ? params.address : userAddress) as string;

    horizon.loadAccount(finalAddress)
      .then((accountResponse) => {
        setResult({
          error: null,
          loading: false,
          account: accountResponse,
        });
      })
      .catch((err: Error) => {
        setResult({
          error: err,
          loading: false,
          account: null,
        });
      });
  }, [params?.address, networkPassphrase, value.user.wallet]);

  return result;
};

export default useAccount;
