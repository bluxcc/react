import React, { useEffect } from 'react';
import { IConfig } from '../../core/dist/types';
import { createConfig } from '../../core/dist/index.esm.js';

type BluxProviderProps = {
  isDemo?: boolean;
  config: IConfig;
  children: React.ReactNode | any;
};

export const BluxProvider = ({ config, children }: BluxProviderProps) => {
  useEffect(() => {
    createConfig(config);
  }, []);

  return <>{children}</>;
};
