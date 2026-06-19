import { useMemo } from 'react';
import { getPayments } from '@bluxcc/core';
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { GetPaymentsOptions } from '@bluxcc/core/dist/exports/core/getPayments';
import { ServerApi } from '@stellar/stellar-sdk/lib/esm/horizon';
import { PaymentCallBuilder } from '@stellar/stellar-sdk/lib/esm/horizon/payment_call_builder';

import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = {
  builder: PaymentCallBuilder;
  response: ServerApi.CollectionPage<
    | ServerApi.CreateAccountOperationRecord
    | ServerApi.PaymentOperationRecord
    | ServerApi.PathPaymentOperationRecord
    | ServerApi.AccountMergeOperationRecord
    | ServerApi.PathPaymentStrictSendOperationRecord
    | ServerApi.InvokeHostFunctionOperationRecord
  >;
};
type O = GetPaymentsOptions;

/**
 * Fetches a paginated list of payment operations from Horizon.
 *
 * Like `useOperations`, but narrowed to payment-type records (payments,
 * create-account, path payments, account merges). Filter by `forAccount`,
 * `forTransaction`, or `forLedger`; set `includeFailed` to include failures.
 *
 * @param options - `forAccount` / `forTransaction` / `forLedger` and
 *   `includeFailed`, plus optional `cursor` / `limit` / `order` and `network`
 *   (defaults to active).
 * @param queryOptions - Optional TanStack Query options. `queryKey`/`queryFn`
 *   are managed by the hook.
 * @returns A TanStack Query result. `data` is `{ builder, response }`;
 *   `response.records` holds the payment-related records.
 *
 * @example
 * ```tsx
 * const { data } = usePayments({ forAccount: 'GA…' });
 * ```
 */
export function usePayments(
  options?: O,
  queryOptions?: QueryOptions<R>,
): UseQueryResult<R, Error> {
  const network = getNetwork(options?.network);
  const enabled = queryOptions?.enabled ?? true;

  const deps = [
    options?.forAccount,
    options?.includeFailed,
    options?.forLedger,
    options?.forTransaction,
    options?.cursor,
    options?.limit,
    options?.network,
    options?.order,
  ];

  const queryKey = useMemo(
    () => ['blux', 'payments', network, ...deps],
    [network, ...deps],
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: O = {
        ...options,
        network,
      };

      return getPayments(opts);
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
