import { useEffect, useState } from "react";
import { getLedgers } from "@bluxcc/core";

import {
  GetLedgersOptions,
  GetLedgersResult,
} from "@bluxcc/core/dist/exports/core/getLedgers";

export type UseLedgersResult = {
  loading: boolean;
  error: Error | null;
  result: GetLedgersResult | null;
};

export function useLedgers(options: GetLedgersOptions): UseLedgersResult {
  const [result, setResult] = useState<GetLedgersResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setResult(null);

    getLedgers(options)
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
  }, [options.network, options.cursor, options.limit, options.order, options.ledger]);

  return { loading, error, result };
}
