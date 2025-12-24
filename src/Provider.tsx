import React, { useEffect, useMemo, useRef } from 'react';
import { createConfig, setAppearance } from '@bluxcc/core';
import { IConfig } from '@bluxcc/core/dist/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type BluxProviderProps = {
  config: IConfig;
  children: React.ReactNode | any;
};

const queryClient = new QueryClient();

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
