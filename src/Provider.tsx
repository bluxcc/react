import React, { useEffect, useMemo, useRef } from 'react';
import { createConfig, setAppearance } from '@bluxcc/core';
import { IConfig } from '@bluxcc/core/dist/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type BluxProviderProps = {
  config: IConfig;
  children: React.ReactNode | any;
};

const queryClient = new QueryClient();

/**
 * Root provider that initializes Blux; it must wrap any part of the app that
 * uses Blux hooks.
 *
 * It applies your `config` (and its optional `appearance`) via the core
 * `createConfig` / `setAppearance`, mounts the host element the wallet modal
 * renders into, and supplies the TanStack `QueryClient` that every query and
 * mutation hook depends on. Place it near the root of your tree.
 *
 * @param props - Component props.
 * @param props.config - The Blux `IConfig` (`appId`, `appName`, `networks`,
 *   optional `defaultNetwork` / `appearance` / `loginMethods` / …) used to
 *   initialize the SDK.
 * @param props.children - Your application tree.
 * @returns The provider element wrapping `children`.
 *
 * @example
 * ```tsx
 * import { BluxProvider, networks } from '@bluxcc/react';
 *
 * const config = {
 *   appId: 'your-app-id',
 *   appName: 'My App',
 *   networks: [networks.testnet],
 * };
 *
 * <BluxProvider config={config}>
 *   <App />
 * </BluxProvider>;
 * ```
 */
export const BluxProvider = ({ config, children }: BluxProviderProps) => {
  const hostRef = useRef<null | HTMLDivElement>(null);

  const { appearance, ...restConfig } = config ?? {};
  const stableRestConfig = useMemo(
    () => restConfig,
    [JSON.stringify(restConfig)],
  );

  useEffect(() => {
    if (hostRef.current) {
      createConfig(config, hostRef.current);
    }
  }, [hostRef, stableRestConfig]);

  useEffect(() => {
    if (hostRef.current) {
      setAppearance(appearance ?? {});
    }
  }, [hostRef, appearance]);

  return (
    <QueryClientProvider client={queryClient}>
      <div ref={hostRef}>{children}</div>
    </QueryClientProvider>
  );
};
