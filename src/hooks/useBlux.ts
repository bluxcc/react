import { useEffect, useState } from 'react';
import { blux, useExportedStore } from '@bluxcc/core';

export const useBlux = () => {
  const [bluxState, setBluxState] = useState(blux);
  const user = useExportedStore((state) => state.user);
  const authState = useExportedStore((state) => state.authState);

  useEffect(() => {
    setBluxState(blux);
  }, [user, authState]);

  return bluxState;
};
