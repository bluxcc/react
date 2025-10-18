import { createConfig } from '@bluxcc/core';
import React, { useEffect, useRef } from 'react';

import { IConfig } from '@bluxcc/core/dist/types';

type BluxProviderProps = {
  config: IConfig;
  children: React.ReactNode | any;
};

export const BluxProvider = ({ config, children }: BluxProviderProps) => {
  const hostRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (hostRef.current) {
      createConfig(config, hostRef.current);
    }
  }, [hostRef, config]);

  return <div ref={hostRef}>{children}</div>;
};
