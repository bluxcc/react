import { Horizon } from '@stellar/stellar-sdk';

import { HORIZON_SERVERS } from '../../constants';

type HorizonServer = Horizon.Server;

type NetworkKey = keyof typeof HORIZON_SERVERS;

const getStellarServer = (network: NetworkKey): HorizonServer => {
  const serverUrl = HORIZON_SERVERS[network];
  return new Horizon.Server(serverUrl);
};

export default getStellarServer;
