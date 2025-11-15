import { useEffect, useState } from "react";
import { getEffects } from "@bluxcc/core";

import {
  GetEffectsOptions,
  GetEffectsResult,
} from "@bluxcc/core/dist/exports/core/getEffects";

export type UseEffectsResult = {
  loading: boolean;
  error: Error | null;
  result: GetEffectsResult | null;
};

export function useEffects(options: GetEffectsOptions): UseEffectsResult {
  const [result, setResult] = useState<GetEffectsResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setResult(null);

    getEffects(options)
      .then((res) => {
        if (!cancelled) {
          setResult(res);
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
    options.forLedger,
    options.forTransaction,
    options.forOperation,
    options.forLiquidityPool,
  ]);

  return { loading, error, result };
}
