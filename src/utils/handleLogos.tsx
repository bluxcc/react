import React from 'react';

import {
  AlbedoLogo,
  FreighterLogo,
  LedgerLogo,
  LobstrLogo,
  RabetLogo,
  XBullLogo,
} from '../assets/logos';

const handleLogos = (walletName: string, fill?: string) => {
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
    case 'Ledger':
      return <LedgerLogo fill={fill} />; // Assuming Ledger uses the same logo as Rabet for now
    default:
      return null;
  }
};

export default handleLogos;
