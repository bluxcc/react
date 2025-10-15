import React, { useEffect } from 'react';
import { createConfig } from '@bluxcc/core';
import { IConfig } from '@bluxcc/core/dist/types';

type BluxProviderProps = {
  config: IConfig;
  children: React.ReactNode | any;
};

export const BluxProvider = ({ config, children }: BluxProviderProps) => {
  useEffect(() => {
    createConfig(config);
  }, []);

  return <>{children}</>;
};
