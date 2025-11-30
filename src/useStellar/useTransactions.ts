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

export type Status = "error" | "pending" | "success";
export type FetchStatus = "fetching" | "idle" | "paused";

export type UseTransactionsBaseResult<TSelect = CoreGetTransactionsResult> = {
  data: TSelect | null;
  result: CoreGetTransactionsResult | null;

  loading: boolean;
  isFetching: boolean;
  fetchStatus: FetchStatus;
  status: Status;
  error: Error | null;

  updatedAt: number | null;
  dataUpdatedAt: number | null;
  errorUpdatedAt: number | null;
  failureCount: number;

  refetch: () => Promise<CoreGetTransactionsResult | undefined>;
  cancel: () => void;

  isStale: boolean;

  isError: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isPaused: boolean;
  isFetched: boolean;
  isLoading: boolean;
  isLoadingError: boolean;
  isRefetchError: boolean;
  isRefetching: boolean;
  isFetchedAfterMount: boolean;
  isPlaceholderData: boolean;
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

  const mountedRef = useRef(false);

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
    return queryOptions?.initialData ? Date.now() : null;
  });

  const [dataUpdatedAt, setDataUpdatedAt] = useState<number | null>(() => {
    if (queryOptions?.initialData && queryOptions?.initialDataUpdatedAt) {
      const val =
        typeof queryOptions.initialDataUpdatedAt === "function"
          ? queryOptions.initialDataUpdatedAt()
          : queryOptions.initialDataUpdatedAt;
      return typeof val === "number" ? val : null;
    }
    return null;
  });

  const [errorUpdatedAt, setErrorUpdatedAt] = useState<number | null>(null);

  const [failureCount, setFailureCount] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [fetchStatus, setFetchStatus] = useState<FetchStatus>(() =>
    enabled ? "idle" : "paused"
  );

  const [isFetched, setIsFetched] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isLoadingError, setIsLoadingError] = useState<boolean>(false);

  const [isRefetchError, setIsRefetchError] = useState<boolean>(false);

  const [isPlaceholderData, setIsPlaceholderData] = useState<boolean>(() => {
    if (queryOptions?.initialData) return false;
    if (queryOptions?.placeholderData) return true;
    return false;
  });

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
    if (dataUpdatedAt === null) return true;
    return Date.now() - dataUpdatedAt >= (staleTimeVal || 0);
  }, [queryOptions?.staleTime, dataUpdatedAt]);

  const [isFetchedAfterMount, setIsFetchedAfterMount] = useState<boolean>(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const runFetch = useCallback(async (): Promise<CoreGetTransactionsResult | undefined> => {
    if (!enabled) {
      setFetchStatus("paused");
      return;
    }

    clearRetryTimer();

    setError(null);
    setLoading(true);
    setFetchStatus("fetching");
    setIsLoadingError(false);
    setIsRefetchError(false);
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
        isFetching: false,
        fetchStatus: "idle",
        isPaused: false,
        status: "success",
        error: null,
        updatedAt: now,
        dataUpdatedAt: now,
        errorUpdatedAt: prevStateRef.current?.errorUpdatedAt ?? null,
        failureCount: 0,
        refetch: async () => res,
        cancel: () => {},
        isStale: false,
        isError: false,
        isPending: false,
        isSuccess: true,
        isFetched: true,
        isLoading: false,
        isLoadingError: false,
        isRefetchError: false,
        isRefetching: false,
        isFetchedAfterMount: mountedRef.current ? true : false,
        isPlaceholderData: false,
      };

      nextState.refetch = refetch as any;
      nextState.cancel = cancel as any;

      hasInitialized.current = true;

      setIsFetched(true);
      setIsLoadingError(false);
      setIsRefetchError(false);
      setIsPlaceholderData(false);
      if (mountedRef.current) {
        setIsFetchedAfterMount(true);
      }

      if (shouldNotifyChange(nextState)) {
        setResult(res);
        setData(selected);
        setError(null);
        setUpdatedAt(now);
        setDataUpdatedAt(now);
        setErrorUpdatedAt(nextState.errorUpdatedAt ?? null);
        setFetchStatus("idle");
        setLoading(false);
      } else {
        setResult(res);
        setData(selected);
        setError(null);
        setUpdatedAt(now);
        setDataUpdatedAt(now);
        setErrorUpdatedAt(nextState.errorUpdatedAt ?? null);
        setFetchStatus("idle");
        setLoading(false);
      }

      prevStateRef.current = nextState;
      return res;
    } catch (err: any) {
      if (cancelledRef.current) return;
      const e = err instanceof Error ? err : new Error(String(err));

      failureCountRef.current = (failureCountRef.current || 0) + 1;
      setFailureCount(failureCountRef.current);

      const now = Date.now();

      const firstFetchFailed = !hasInitialized.current;
      const refetchFailed = !firstFetchFailed;

      const nextState: UseTransactionsBaseResult<TSelect> = {
        data: null,
        result: null,
        loading: false,
        isFetching: false,
        fetchStatus: "idle",
        isPaused: false,
        status: "error",
        error: e,
        updatedAt: now,
        dataUpdatedAt: dataUpdatedAt,
        errorUpdatedAt: now,
        failureCount: failureCountRef.current,
        refetch: async () => undefined,
        cancel: () => {},
        isStale: isStale(),
        isError: true,
        isPending: false,
        isSuccess: false,
        isFetched: true,
        isLoading: false,
        isLoadingError: firstFetchFailed,
        isRefetchError: refetchFailed,
        isRefetching: false,
        isFetchedAfterMount: mountedRef.current ? true : false,
        isPlaceholderData: false,
      };

      nextState.refetch = refetch as any;
      nextState.cancel = cancel as any;

      setIsFetched(true);
      if (firstFetchFailed) {
        setIsLoadingError(true);
      }
      if (refetchFailed) {
        setIsRefetchError(true);
      }
      setIsPlaceholderData(false);
      if (mountedRef.current) {
        setIsFetchedAfterMount(true);
      }

      if (shouldNotifyChange(nextState)) {
        setResult(null);
        setData(null);
        setError(e);
        setUpdatedAt(now);
        setErrorUpdatedAt(now);
        setFetchStatus("idle");
        setLoading(false);
      } else {
        setError(e);
        setUpdatedAt(now);
        setErrorUpdatedAt(now);
        setFetchStatus("idle");
        setLoading(false);
      }

      prevStateRef.current = nextState;

      const shouldRetry = computeShouldRetry(failureCountRef.current, e);

      if (shouldRetry) {
        const delay = computeRetryDelayMs(failureCountRef.current, e);
        clearRetryTimer();
        retryTimerRef.current = setTimeout(() => {
          if (cancelledRef.current) return;
          runFetch().catch(() => {});
        }, delay);
      }

      return undefined;
    }
  }, [options, enabled, shouldNotifyChange, runSelect, queryOptions?.retry, queryOptions?.retryDelay, dataUpdatedAt]);

  const refetch = useCallback(async () => {
    clearRetryTimer();
    failureCountRef.current = 0;
    setFailureCount(0);
    cancelledRef.current = false;
    setIsLoadingError(false);
    setIsRefetchError(false);
    return runFetch();
  }, [runFetch]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    clearRetryTimer();
    setLoading(false);
  }, []);

  const status: Status = error ? "error" : !hasInitialized.current ? "pending" : "success";

  const isError = status === "error";
  const isPending = status === "pending";
  const isSuccess = status === "success";

  const derivedIsFetching = fetchStatus === "fetching";
  const derivedIsPaused = fetchStatus === "paused";

  const derivedIsLoading = derivedIsFetching && isPending;
  const derivedIsRefetching = derivedIsFetching && !isPending;

  useEffect(() => {
    setIsLoading(derivedIsLoading);
  }, [derivedIsLoading]);

  const currentState: UseTransactionsBaseResult<TSelect> = {
    data,
    result,
    loading,
    isFetching: derivedIsFetching,
    fetchStatus,
    isPaused: derivedIsPaused,
    status,
    error,
    updatedAt,
    dataUpdatedAt,
    errorUpdatedAt,
    failureCount,
    refetch,
    cancel,
    isStale: isStale(),

    isError,
    isPending,
    isSuccess,

    isFetched,
    isLoading,
    isLoadingError,
    isRefetchError,
    isRefetching: derivedIsRefetching,
    isFetchedAfterMount,
    isPlaceholderData,
  };

  prevStateRef.current = currentState;

  useEffect(() => {
    if (!enabled) {
      setFetchStatus("paused");
    } else {
      setFetchStatus((s) => (s === "fetching" ? s : "idle"));
    }
  }, [enabled]);

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
  }, [runFetch, enabled, queryOptions?.refetchOnMount, queryOptions?.staleTime, dataUpdatedAt]);

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
  }, [
    enabled,
    queryOptions?.refetchOnWindowFocus,
    queryOptions?.refetchOnReconnect,
    queryOptions?.staleTime,
    dataUpdatedAt,
    isStale,
    runFetch,
  ]);

  useEffect(() => {
    return () => {
      clearRetryTimer();
      cancelledRef.current = true;
    };
  }, []);

  return currentState;
}

export default useTransactions;
