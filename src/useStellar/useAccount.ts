import { core } from '@bluxcc/core';

import { GetAccountResult } from '../../../core/dist/types';

import { useEffect, useState } from 'react';

export type UseAccountResult = {
  loading: boolean;
  error: Error | null;
  result: GetAccountResult;
};

function useAccount(options: GetAccountOptions): UseAccountResult {
  const [result, setResult] = useState<GetAccountResult>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    core
      .getAccount(options)
      .then((x) => {
        setResult(x);
      })
      .catch((e) => {
        setError(e);
      });

    setLoading(false);
  }, [options.address, options.network]);

  return { loading, error, result };
}

export default useAccount;
