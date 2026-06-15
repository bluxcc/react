import { writeContract } from '@bluxcc/core';
import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import type {
  IContractCall,
  WriteContractsOptions,
} from '@bluxcc/core/dist/exports/utils';

import type { MutationOptions } from '../utils';

type R = Awaited<ReturnType<typeof writeContract>>;

export type WriteContractVariables = {
  call: IContractCall;
  options?: WriteContractsOptions;
};

type V = WriteContractVariables;

export function useWriteContract(
  mutationOptions?: MutationOptions<R, V>
): UseMutationResult<R, Error, V> {
  return useMutation<R, Error, V>({
    ...(mutationOptions as UseMutationOptions<R, Error, V> | undefined),
    mutationFn: async ({ call, options }) => writeContract(call, options),
  });
}
