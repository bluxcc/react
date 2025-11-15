import { useEffect, useState } from "react";
import { getBalances } from '@bluxcc/core';

import { GetBalancesOptions, GetBalancesResult } from '@bluxcc/core/dist/exports/core/getBalances';

export type UseBalancesResult = {
  loading: boolean;
  error: Error | null;
  balances: GetBalancesResult;
};

export function useBalances(options: GetBalancesOptions | undefined): UseBalancesResult {
  const [balances, setBalances] = useState<GetBalancesResult>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!options?.address) {
      setBalances([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getBalances(options);

        if (!cancelled) {
          setBalances(result ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setBalances([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [options?.address, options?.network, options?.includeZeroBalances]);

  return { loading, error, balances };
}

export default useBalances;