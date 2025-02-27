import React from 'react';

import { AlbedoLogo, FreighterLogo, LobstrLogo, RabetLogo, XBullLogo } from '../assets/logos';

const handleLogos = (walletName: string) => {
  switch (walletName) {
    case 'Rabet':
      return <RabetLogo />;
    case 'Freighter':
      return <FreighterLogo />;
    case 'Albedo':
      return <AlbedoLogo />;
    case 'LOBSTR':
      return <LobstrLogo />;
    case 'xBull':
      return <XBullLogo />;
    default:
      return null;
  }
};

export default handleLogos;
