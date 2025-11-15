// Upon testing, it either gives "Bad Request" or "Custom network has no transports."

import { useEffect, useState } from "react";
import { getAssets } from "@bluxcc/core";

import {
  GetAssetsOptions,
  GetAssetsResult,
} from "@bluxcc/core/dist/exports/core/getAssets";

export type UseAssetsResult = {
  loading: boolean;
  error: Error | null;
  result: GetAssetsResult | null;
};

export function useAssets(options: GetAssetsOptions): UseAssetsResult {
  const [result, setResult] = useState<GetAssetsResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getAssets(options)
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
    options.forCode,
    options.forIssuer,
  ]);

  return { loading, error, result };
}