import { useState, useEffect } from "react";
import { getAccounts } from "@bluxcc/core"; // or your local path
import {
  GetAccountsOptions,
  GetAccountsResult,
} from "@bluxcc/core/dist/exports/core/getAccounts";

export type UseAccountsResult = {
  loading: boolean;
  error: Error | null;
  result: GetAccountsResult | null;
};

export function useAccounts(options: GetAccountsOptions): UseAccountsResult {
  const [result, setResult] = useState<GetAccountsResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!options.network) return;

    const fetchAccounts = async () => {
      setLoading(true);
      setError(null);

      try {
        const accounts = await getAccounts(options);
        setResult(accounts);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [
    options.network,
    options.forSigner,
    options.forAsset?.code,
    options.forAsset?.issuer,
    options.forLiquidityPool,
    options.sponsor,
    options.cursor,
    options.limit,
    options.order,
  ]);

  return { loading, error, result };
}
