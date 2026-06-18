import { useMemo } from 'react';
import { getLedgers } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetLedgersResult,
  GetLedgersOptions,
} from "@bluxcc/core/dist/exports/core/getLedgers";

import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetLedgersResult;
type O = GetLedgersOptions;

/**
 * Fetches ledgers from Horizon — either the latest ledgers or a single one.
 *
 * Pass `ledger` (a sequence number) to load one specific ledger; omit it to page
 * through the most recent ledgers.
 *
 * @param options - `ledger` (a sequence number for a single ledger), plus
 *   optional `cursor` / `limit` / `order` and `network` (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`;
 *   `response.records` holds the ledger records.
 *
 * @example
 * ```tsx
 * const { data } = useLedgers({ limit: 10, order: 'desc' });
 * ```
 */
export function useLedgers(
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.ledger,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'ledgers', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getLedgers(opts);
    },
    [network, options, ...deps],
  );

  const result = useQuery<R, Error>({
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
    enabled,
    queryKey,
    queryFn,
  });

  return result;
}