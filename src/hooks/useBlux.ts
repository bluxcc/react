import { useContext } from 'react';
import { ProviderContext } from '../context/provider';
import { IUser } from '../types';

export const useBlux = () => {
  const context = useContext(ProviderContext);

  const connect = async () => {
    context?.setValue({
      ...context.value,
      modal: {
        isOpen: true,
      },
    });
  };

  const ready = () => {
    return context?.value.ready;
  };

  const user = (): IUser | null => {
    return context?.value.user || null;
  };

  const disconnect = async () => {
    context?.setValue({
      ...context.value,
      user: { wallet: null },
      modal: { isOpen: false },
    });
  };

  return { connect, user, disconnect, ready };
};
