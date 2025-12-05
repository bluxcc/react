import { getState } from '@bluxcc/core';

export type CallBuilderOptions = {
  cursor?: string;
  limit?: number;
  network?: string;
  order?: 'asc' | 'desc';
};

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