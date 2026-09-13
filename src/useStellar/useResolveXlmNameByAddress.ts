import { useMemo } from 'react';
import {
  resolveXlmNameByAddress,
  type XlmAccountNameRecord,
  type XlmNameLookupOptions,
} from '@bluxcc/core';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import type { QueryOptions } from '../utils';

/**
 * Finds one verified `.xlm` name associated with a classic Stellar account.
 *
 * The query accepts only a `G…` account address and stays disabled until the
 * address is non-empty. If the account owns multiple names, XLM Domains chooses
 * which reverse record to return.
 *
 * @param address - A classic Stellar account address (`G…`).
 * @param options - Optional SEP-2 connection options.
 * @param queryOptions - Optional TanStack Query options. `queryKey` and
 *   `queryFn` are managed by the hook.
 * @returns A TanStack Query result containing an {@link XlmAccountNameRecord}.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useResolveXlmNameByAddress('G…');
 * console.log(data?.name);
 * ```
 */
export function useResolveXlmNameByAddress(
  address: string,
  options?: XlmNameLookupOptions,
  queryOptions?: QueryOptions<XlmAccountNameRecord>,
): UseQueryResult<XlmAccountNameRecord, Error> {
  const publicKey = address.trim();
  const allowHttp = options?.allowHttp;
  const timeout = options?.timeout;
  const enabled = (queryOptions?.enabled ?? true) && Boolean(publicKey);

  const queryKey = useMemo(
    () => ['blux', 'resolveXlmNameByAddress', publicKey, allowHttp, timeout],
    [publicKey, allowHttp, timeout],
  );

  const queryFn = useMemo(
    () => () =>
      resolveXlmNameByAddress(publicKey, {
        allowHttp,
        timeout,
      }),
    [publicKey, allowHttp, timeout],
  );

  return useQuery<XlmAccountNameRecord, Error>({
    ...(queryOptions as
      | UseQueryOptions<XlmAccountNameRecord, Error>
      | undefined),
    enabled,
    queryKey,
    queryFn,
  });
}
