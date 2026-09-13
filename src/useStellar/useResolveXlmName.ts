import { useMemo } from 'react';
import {
  resolveXlmName,
  type XlmNameLookupOptions,
  type XlmNameRecord,
} from '@bluxcc/core';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import type { QueryOptions } from '../utils';

/**
 * Resolves a `.xlm` name to a validated account or contract record.
 *
 * The query is independent of Blux's active transaction network because XLM
 * Domains uses its mainnet registry. It stays disabled until `name` is non-empty.
 *
 * @param name - A `.xlm` name such as `alice.xlm` or `token.xlm`.
 * @param options - Optional SEP-2 connection options.
 * @param queryOptions - Optional TanStack Query options. `queryKey` and
 *   `queryFn` are managed by the hook.
 * @returns A TanStack Query result containing an {@link XlmNameRecord}.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useResolveXlmName('alice.xlm');
 * console.log(data?.address);
 * ```
 */
export function useResolveXlmName(
  name: string,
  options?: XlmNameLookupOptions,
  queryOptions?: QueryOptions<XlmNameRecord>,
): UseQueryResult<XlmNameRecord, Error> {
  const normalizedName = name.trim().toLowerCase();
  const allowHttp = options?.allowHttp;
  const timeout = options?.timeout;
  const enabled = (queryOptions?.enabled ?? true) && Boolean(normalizedName);

  const queryKey = useMemo(
    () => ['blux', 'resolveXlmName', normalizedName, allowHttp, timeout],
    [normalizedName, allowHttp, timeout],
  );

  const queryFn = useMemo(
    () => () => resolveXlmName(normalizedName, { allowHttp, timeout }),
    [normalizedName, allowHttp, timeout],
  );

  return useQuery<XlmNameRecord, Error>({
    ...(queryOptions as UseQueryOptions<XlmNameRecord, Error> | undefined),
    enabled,
    queryKey,
    queryFn,
  });
}
