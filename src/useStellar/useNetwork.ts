import { useExportedStore } from '@bluxcc/core';
import { useEffect, useState } from 'react';

export const useNetwork = () => {
  const store = useExportedStore((state) => state);
  const [currentNetwork, setCurrentNetwork] = useState(
    store.stellar?.activeNetwork || store.config.defaultNetwork,
  );

  useEffect(() => {
    setCurrentNetwork(
      store.stellar?.activeNetwork || store.config.defaultNetwork,
    );
  }, [store.stellar, store.config]);

  return currentNetwork;
};
