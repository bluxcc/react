import { useMemo } from 'react';
import { getPayments } from "@bluxcc/core";
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  GetPaymentsOptions,
} from "@bluxcc/core/dist/exports/core/getPayments";

import { PaymentCallBuilder } from '@stellar/stellar-sdk/lib/horizon/payment_call_builder';
import { ServerApi } from '@stellar/stellar-sdk/lib/horizon';
import { getNetwork } from '../utils';
import type { QueryOptions } from '../utils';

type R = {
    builder: PaymentCallBuilder;
    response: ServerApi.CollectionPage<ServerApi.CreateAccountOperationRecord | ServerApi.PaymentOperationRecord | ServerApi.PathPaymentOperationRecord | ServerApi.AccountMergeOperationRecord | ServerApi.PathPaymentStrictSendOperationRecord | ServerApi.InvokeHostFunctionOperationRecord>;
}
type O = GetPaymentsOptions;

export function usePayments(
  options?: O,
  queryOptions?: QueryOptions<R>
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