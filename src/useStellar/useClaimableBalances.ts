// Gives "Issuer is invalid"

import { useEffect, useState } from "react";
import { getClaimableBalances } from "@bluxcc/core";

import {
  GetClaimableBalancesOptions,
  GetClaimableBalancesResult,
} from "@bluxcc/core/dist/exports/core/getClaimableBalances";

export type UseClaimableBalancesResult = {
  loading: boolean;
  error: Error | null;
  result: GetClaimableBalancesResult | null;
};

export function useClaimableBalances(
  options: GetClaimableBalancesOptions
): UseClaimableBalancesResult {
  const [result, setResult] = useState<GetClaimableBalancesResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setResult(null);

    getClaimableBalances(options)
      .then((r) => {
        if (!cancelled) {
          setResult(r);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    options.network,
    options.cursor,
    options.limit,
    options.order,
    
    options.asset,
    options.claimant,
    options.sponsor,
  ]);

  return { loading, error, result };
}
