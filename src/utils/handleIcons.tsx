import React from 'react';

import { AlbedoIcon, FreighterIcon, LobstrIcon, RabetIcon, XBullIcon } from '../assets/logos';

const handleIcons = (walletName: string) => {
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

export default handleIcons;
