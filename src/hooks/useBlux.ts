import { useEffect, useState } from 'react';
import { blux, useExportedStore } from '../../../core/dist/index.esm.js';

export const useBlux = () => {
  const [bluxState, setBluxState] = useState(blux);
  const store = useExportedStore((state: any) => state);

  useEffect(() => {
    setBluxState(blux);
  }, [store]);

  return bluxState;
};
