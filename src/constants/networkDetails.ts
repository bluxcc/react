import { networks } from "../networks";
import { Url, url } from "../utils/network/url";

export interface NetworkDetails {
  name: string;
  horizon?: Url;
  soroban?: Url;
}

const NETWORKS_DETAILS: Record<string, NetworkDetails> = {
  [networks.mainnet]: {
    name: 'Mainnet',
    horizon: url('https://horizon.stellar.org'),
    soroban: url('https://mainnet.sorobanrpc.com'),
  },
  [networks.testnet]: {
    name: 'Testnet',
    horizon: url('https://horizon-testnet.stellar.org'),
    soroban: url('https://soroban-testnet.stellar.org'),
  },
  [networks.futurenet]: {
    name: 'Futurenet',
    horizon: url('https://horizon-futurenet.stellar.org'),
    soroban: url('https://rpc-futurenet.stellar.org'),
  },
}

export default NETWORKS_DETAILS;
