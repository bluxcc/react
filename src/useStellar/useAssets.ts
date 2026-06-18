import { useMemo } from 'react';
import { getAssets } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetAssetsResult,
  GetAssetsOptions,
} from "@bluxcc/core/dist/exports/core/getAssets";

import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = GetAssetsResult;
type O = GetAssetsOptions;

/**
 * Fetches a paginated list of assets issued on the network from Horizon.
 *
 * Optionally narrow the list by `forCode` (asset code, e.g. "USDC") and/or
 * `forIssuer` (the issuing `G…` address). With no filter it returns all assets.
 *
 * @param options - `forCode` / `forIssuer` filters, plus optional
 *   `cursor` / `limit` / `order` and `network` (defaults to the active network).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`;
 *   `response.records` holds the asset records (supply, flags, issuer, …).
 *
 * @example
 * ```tsx
 * const { data } = useAssets({ forCode: 'USDC' });
 * ```
 */
export function useAssets(
  options?: O,
  queryOptions?: QueryOptions<R>
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forCode,
    options?.forIssuer,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'assets', network, ...deps],
    [network, options, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getAssets(opts);
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