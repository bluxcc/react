import { useMemo } from 'react';
import { getOffers } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetOffersResult,
  GetOffersOptions,
} from "@bluxcc/core/dist/exports/core/getOffers";

import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetOffersResult;
type O = GetOffersOptions;

/**
 * Fetches a paginated list of open DEX offers from Horizon.
 *
 * Filter by `forAccount` / `seller` (offers created by an account),
 * `buying` / `selling` (offers on a given asset side), or `sponsor`.
 *
 * @param options - `forAccount` / `seller` / `buying` / `selling` / `sponsor`
 *   filters, plus optional `cursor` / `limit` / `order` and `network` (defaults
 *   to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`;
 *   `response.records` holds the offer records (price, amount, assets).
 *
 * @example
 * ```tsx
 * const { data } = useOffers({ seller: 'GA…' });
 * ```
 */
export function useOffers(
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forAccount,
    options?.buying,
    options?.selling,
    options?.sponsor,
    options?.seller,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'offers', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getOffers(opts);
    },
    [network, ...deps],
  );

  const result = useQuery<R, Error>({
    ...(queryOptions as UseQueryOptions<R, Error> | undefined),
    enabled,
    queryKey,
    queryFn,
  });

  return result;
}