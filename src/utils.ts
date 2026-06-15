import { getState } from '@bluxcc/core';
import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

export type CallBuilderOptions = {
  cursor?: string;
  limit?: number;
  network?: string;
  order?: 'asc' | 'desc';
};

export type QueryOptions<T> = Omit<
  UseQueryOptions<T, Error>,
  "queryKey" | "queryFn"
>;

export type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
>;

export const checkConfigCreated = () => {
  const { stellar } = getState();

  return !!stellar;
};

export const getAddress = (address?: string) => {
  const { user } = getState();

  if (address) {
    return address;
  }

  return user?.address as string;
};

export const getNetwork = (network?: string) => {
  const { stellar } = getState();

  if (!network && stellar) {
    return stellar.activeNetwork;
  }

  return network;
};