import { networks, switchNetwork } from '@bluxcc/core';

/**
 * Provides the list of configured networks and a setter to change the active
 * one.
 *
 * Switching updates the Blux store; components that read the network via
 * `useNetwork` (and network-scoped queries) update accordingly.
 *
 * @returns `{ networks, switchNetwork }` — `networks` is the map of available
 *   networks (`mainnet` / `testnet` / `sandbox` / `futurenet` / `standalone`)
 *   and `switchNetwork(network)` sets the active network.
 *
 * @example
 * ```tsx
 * const { networks, switchNetwork } = useSwitchNetwork();
 * <button onClick={() => switchNetwork(networks.testnet)}>Use testnet</button>;
 * ```
 */
export const useSwitchNetwork = () => {
  return {
    networks,
    switchNetwork,
  };
};
