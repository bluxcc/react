import React from 'react';

import { SupportedWallets } from '../types';
import { AlbedoIcon, FreighterIcon, LobstrIcon, RabetIcon, XBullIcon } from '../assets/walletsLogo';

export const handleIcons = (walletName: SupportedWallets | string) => {
  switch (walletName) {
    case 'Rabet':
      return <RabetIcon />;
    case 'Freighter':
      return <FreighterIcon />;
    case 'Albedo':
      return <AlbedoIcon />;
    case 'LOBSTR':
      return <LobstrIcon />;
    case 'xBull':
      return <XBullIcon />;
    default:
      return null;
  }
};
