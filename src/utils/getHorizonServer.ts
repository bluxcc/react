import { HORIZON_SERVERS } from '../constants';
import { Horizon } from '@stellar/stellar-sdk';

type HorizonServer = Horizon.Server;

type NetworkKey = keyof typeof HORIZON_SERVERS;

export const getHorizonServer = (network: NetworkKey): HorizonServer => {
  const serverUrl = HORIZON_SERVERS[network];
  return new Horizon.Server(serverUrl);
};
