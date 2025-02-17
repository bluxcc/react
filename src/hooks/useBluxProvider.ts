import { useContext } from 'react';
import { BluxProviderContext } from '../context/provider';

export const useBluxProvider = () => {
  const context = useContext(BluxProviderContext);
  if (!context) {
    throw new Error('useBluxProvider must be used within a ProviderContext.');
  }
  return context;
};
