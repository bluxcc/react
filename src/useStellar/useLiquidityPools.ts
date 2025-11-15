// Gives "Issuer is invalid"

import { useEffect, useState } from "react";
import { getLiquidityPools } from "@bluxcc/core";

import {
  GetLiquidityPoolsOptions,
  GetLiquidityPoolsResult,
} from "@bluxcc/core/dist/exports/core/getLiquidityPools";

export type UseLiquidityPoolsResult = {
  loading: boolean;
  error: Error | null;
  result: GetLiquidityPoolsResult | null;
};

export function useLiquidityPools(
  options: GetLiquidityPoolsOptions
): UseLiquidityPoolsResult {
  const [result, setResult] = useState<GetLiquidityPoolsResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setResult(null);

    getLiquidityPools(options)
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
    options.forAccount,
    options.forAssets,
  ]);

  return { loading, error, result };
}
