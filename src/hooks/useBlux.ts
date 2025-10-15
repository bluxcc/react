import { useEffect, useState } from 'react';
import { blux, useExportedStore } from '@bluxcc/core';

export const useBlux = () => {
  const [bluxState, setBluxState] = useState(blux);
  const store = useExportedStore((state: any) => state);

  useEffect(() => {
    setBluxState(blux);
  }, [store]);

  return bluxState;
};
