import { getAccount } from '@bluxcc/core';
import { useEffect, useState } from 'react';
import {
  GetAccountResult,
  GetAccountOptions,
} from '@bluxcc/core/dist/exports/core/getAccount';

export type UseAccountResult = {
  loading: boolean;
  error: Error | null;
  result: GetAccountResult;
};

export function useAccount(options: GetAccountOptions): UseAccountResult {
  // TODO: we need the same exact function as the core function here.
  // Take the options.address, options.network, pass it to it, and wait for changes
  // In useEffect.
  const [result, setResult] = useState<GetAccountResult>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    getAccount(options)
      .then((r) => {
        setResult(r);

        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, [options.address, options.network]);

  return { loading, error, result };
}
