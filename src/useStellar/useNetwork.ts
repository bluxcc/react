import { useExportedStore } from '@bluxcc/core';
import { useEffect, useState } from 'react';

/**
 * Returns the currently active Stellar network and re-renders when it changes.
 *
 * Reads the active network from the Blux store (falling back to the configured
 * `defaultNetwork`), so components stay in sync after
 * `useSwitchNetwork().switchNetwork(...)`.
 *
 * @returns The active network passphrase — the value the other hooks accept as
 *   their `network` option (one of `networks.mainnet` / `testnet` / …).
 *
 * @example
 * ```tsx
 * const network = useNetwork();
 * return <span>Connected to {network}</span>;
 * ```
 */
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
