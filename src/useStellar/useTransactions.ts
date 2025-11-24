import { useCallback, useEffect, useRef, useState } from "react";
import { getTransactions as coreGetTransactions } from "@bluxcc/core";

import type {
  GetTransactionsOptions as CoreGetTransactionsOptions,
  GetTransactionsResult as CoreGetTransactionsResult,
} from "@bluxcc/core/dist/exports/core/getTransactions";

export type QueryOptions<TSelect = CoreGetTransactionsResult> = {
  enabled?: boolean;
  retry?: boolean | number | ((failureCount: number, error: Error) => boolean);
  retryDelay?: number | ((retryAttempt: number, error: Error) => number);
  initialData?: CoreGetTransactionsResult | (() => CoreGetTransactionsResult);
  initialDataUpdatedAt?: number | (() => number | undefined);
  placeholderData?:
    | CoreGetTransactionsResult
    | ((
        previousValue: CoreGetTransactionsResult | undefined,
        previousQuery: UseTransactionsBaseResult<TSelect> | undefined
      ) => CoreGetTransactionsResult);
  notifyOnChangeProps?: string[] | "all" | (() => string[] | "all");
  refetchInterval?:
    | number
    | false
    | ((data: CoreGetTransactionsResult | undefined, query: UseTransactionsBaseResult<TSelect>) => number | false | undefined);
  refetchIntervalInBackground?: boolean;
  staleTime?: number | typeof Infinity | undefined;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  select?: (data: CoreGetTransactionsResult) => TSelect;
};

export type UseTransactionsBaseResult<TSelect = CoreGetTransactionsResult> = {
  data: TSelect | null;
  result: CoreGetTransactionsResult | null;

  loading: boolean;
  error: Error | null;
  updatedAt: number | null;
  failureCount: number;
  refetch: () => Promise<void>;
  cancel: () => void;

  isStale: boolean;
};

export function useTransactions<TSelect = CoreGetTransactionsResult>(
  options: CoreGetTransactionsOptions,
  queryOptions?: QueryOptions<TSelect>
): UseTransactionsBaseResult<TSelect> {
  const enabled = queryOptions?.enabled !== false;

  const hasInitialized = useRef(false);
  const prevStateRef = useRef<UseTransactionsBaseResult<TSelect> | null>(null);
  const cancelledRef = useRef(false);

  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failureCountRef = useRef<number>(0);

  const runSelect = useCallback(
    (res: CoreGetTransactionsResult): TSelect | null => {
      if (!queryOptions?.select) {
        return (res as unknown) as TSelect;
      }
      try {
        return queryOptions.select(res);
      } catch (e) {
        console.error("select() threw an error:", e);
        return null;
      }
    },
    [queryOptions?.select]
  );

  const [result, setResult] = useState<CoreGetTransactionsResult | null>(() => {
    if (queryOptions?.initialData) {
      hasInitialized.current = true;
      return typeof queryOptions.initialData === "function"
        ? (queryOptions.initialData as () => CoreGetTransactionsResult)()
        : queryOptions.initialData;
    }
    if (queryOptions?.placeholderData) {
      return typeof queryOptions.placeholderData === "function"
        ? queryOptions.placeholderData(undefined, undefined)
        : queryOptions.placeholderData;
    }
    return null;
  });

  const [data, setData] = useState<TSelect | null>(() => {
    const initial = queryOptions?.initialData
      ? typeof queryOptions.initialData === "function"
        ? (queryOptions.initialData as () => CoreGetTransactionsResult)()
        : queryOptions.initialData
      : queryOptions?.placeholderData
      ? typeof queryOptions.placeholderData === "function"
        ? queryOptions.placeholderData(undefined, undefined)
        : queryOptions.placeholderData
      : null;

    if (!initial) return null;
    return runSelect(initial);
  });

  const [updatedAt, setUpdatedAt] = useState<number | null>(() => {
    if (queryOptions?.initialData && queryOptions?.initialDataUpdatedAt) {
      const val =
        typeof queryOptions.initialDataUpdatedAt === "function"
          ? queryOptions.initialDataUpdatedAt()
          : queryOptions.initialDataUpdatedAt;
      return typeof val === "number" ? val : null;
    }
    return null;
  });

  const [failureCount, setFailureCount] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const shouldNotifyChange = useCallback(
    (nextState: UseTransactionsBaseResult<TSelect>) => {
      const rule = queryOptions?.notifyOnChangeProps;
      if (!rule) return true;

      const prev = prevStateRef.current;
      if (!prev) return true;

      const keys = typeof rule === "function" ? rule() : rule;
      if (keys === "all") return true;

      for (const key of keys) {
        if (prev[key as keyof UseTransactionsBaseResult<TSelect>] !== nextState[key as keyof UseTransactionsBaseResult<TSelect>]) {
          return true;
        }
      }
      return false;
    },
    [queryOptions?.notifyOnChangeProps]
  );

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const computeShouldRetry = (count: number, err: Error): boolean => {
    const opt = queryOptions?.retry;
    if (opt === undefined) {
      return count < 3;
    }
    if (typeof opt === "boolean") {
      return opt === true;
    }
    if (typeof opt === "number") {
      return count < opt;
    }
    if (typeof opt === "function") {
      try {
        return Boolean(opt(count, err));
      } catch (e) {
        console.warn("retry function threw", e);
        return false;
      }
    }
    return false;
  };

  const computeRetryDelayMs = (attempt: number, err?: Error): number => {
    const opt = queryOptions?.retryDelay;

    const defaultDelay = Math.min(1000 * 2 ** (attempt - 1), 30000);

    if (opt === undefined) return defaultDelay;
    if (typeof opt === "number") {
      return Math.max(0, Math.floor(opt));
    }
    if (typeof opt === "function") {
      try {
        const val = opt(attempt, err as Error);
        return typeof val === "number" && !Number.isNaN(val) ? Math.max(0, Math.floor(val)) : defaultDelay;
      } catch (e) {
        console.warn("retryDelay function threw", e);
        return defaultDelay;
      }
    }
    return defaultDelay;
  };

  const isStale = useCallback((): boolean => {
    const staleTimeVal = queryOptions?.staleTime ?? 0;
    if (staleTimeVal === Infinity) return false;
    if (updatedAt === null) return true;
    return Date.now() - updatedAt >= (staleTimeVal || 0);
  }, [queryOptions?.staleTime, updatedAt]);

  const runFetch = useCallback(async () => {
    if (!enabled) return;

    clearRetryTimer();

    setError(null);
    setLoading(true);
    cancelledRef.current = false;

    try {
      const res = await coreGetTransactions(options);
      if (cancelledRef.current) return;

      failureCountRef.current = 0;
      setFailureCount(0);
      clearRetryTimer();

      const selected = runSelect(res);

      const now = Date.now();

      const nextState: UseTransactionsBaseResult<TSelect> = {
        data: selected,
        result: res,
        loading: false,
        error: null,
        updatedAt: now,
        failureCount: 0,
        refetch: async () => {},
        cancel: () => {},
        isStale: false,
      };

      nextState.refetch = refetch as any;
      nextState.cancel = cancel as any;

      hasInitialized.current = true;

      if (shouldNotifyChange(nextState)) {
        setResult(res);
        setData(selected);
        setError(null);
        setUpdatedAt(now);
      }

      prevStateRef.current = nextState;
    } catch (err: any) {
      if (cancelledRef.current) return;
      const e = err instanceof Error ? err : new Error(String(err));

      failureCountRef.current = (failureCountRef.current || 0) + 1;
      setFailureCount(failureCountRef.current);

      setResult(null);
      setData(null);
      setError(e);

      const shouldRetry = computeShouldRetry(failureCountRef.current, e);

      if (shouldRetry) {
        const delay = computeRetryDelayMs(failureCountRef.current, e);
        clearRetryTimer();
        retryTimerRef.current = setTimeout(() => {
          if (cancelledRef.current) return;
          runFetch().catch(() => {});
        }, delay);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [options, enabled, shouldNotifyChange, runSelect, queryOptions?.retry, queryOptions?.retryDelay]);

  const refetch = useCallback(async () => {
    clearRetryTimer();
    failureCountRef.current = 0;
    setFailureCount(0);
    cancelledRef.current = false;
    await runFetch();
  }, [runFetch]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    clearRetryTimer();
    setLoading(false);
  }, []);

  const currentState: UseTransactionsBaseResult<TSelect> = {
    data,
    result,
    loading,
    error,
    updatedAt,
    failureCount,
    refetch,
    cancel,
    isStale: isStale(),
  };

  prevStateRef.current = currentState;

  useEffect(() => {
    if (!enabled) return;

    cancelledRef.current = false;

    const shouldInitialFetch = !hasInitialized.current || (hasInitialized.current && queryOptions?.refetchOnMount && isStale());

    if (shouldInitialFetch) {
      runFetch().catch(() => {});
    }

    return () => {
      cancelledRef.current = true;
      clearRetryTimer();
    };
  }, [runFetch, enabled, queryOptions?.refetchOnMount, queryOptions?.staleTime, updatedAt]);

  useEffect(() => {
    if (!enabled) return;

    const onFocus = () => {
      if (queryOptions?.refetchOnWindowFocus && isStale()) {
        runFetch().catch(() => {});
      }
    };

    const onOnline = () => {
      if (queryOptions?.refetchOnReconnect && isStale()) {
        runFetch().catch(() => {});
      }
    };

    if (queryOptions?.refetchOnWindowFocus) {
      window.addEventListener("focus", onFocus);
    }
    if (queryOptions?.refetchOnReconnect) {
      window.addEventListener("online", onOnline);
    }

    return () => {
      if (queryOptions?.refetchOnWindowFocus) {
        window.removeEventListener("focus", onFocus);
      }
      if (queryOptions?.refetchOnReconnect) {
        window.removeEventListener("online", onOnline);
      }
    };
  }, [enabled, queryOptions?.refetchOnWindowFocus, queryOptions?.refetchOnReconnect, queryOptions?.staleTime, updatedAt, isStale, runFetch]);

  useEffect(() => {
    return () => {
      clearRetryTimer();
      cancelledRef.current = true;
    };
  }, []);

  return currentState;
}

export default useTransactions;