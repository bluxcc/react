import React from 'react';

import {
  AlbedoLogo,
  FreighterLogo,
  HanaLogo,
  LobstrLogo,
  RabetLogo,
  XBullLogo,
} from '../assets/logos';

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
    case 'Hana':
      return <HanaLogo />;
    default:
      return null;
  }
};

export default handleLogos;
