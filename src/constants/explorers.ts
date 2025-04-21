import { networks } from "../networks";

export type IExplorerDetail = {
  ledgerUrl: string;
  accountUrl: string;
  operationUrl?: string;
  transactionUrl: string;
  [key: string]: string | undefined;
}

const EXPLORERS: Record<string, IExplorerDetail> = {
  steexp: {
    [networks.mainnet]: 'https://steexp.com',
    [networks.testnet]: 'https://testnet.steexp.com',
    ledgerUrl: 'ledger',
    transactionUrl: 'tx',
    accountUrl: 'account',
  },
  stellarexpert: {
    [networks.mainnet]: 'https://stellar.expert/explorer/public',
    [networks.testnet]: 'https://stellar.expert/explorer/testnet',
    ledgerUrl: 'ledger',
    accountUrl: 'account',
    transactionUrl: 'tx',
  },
  lumenscan: {
    [networks.mainnet]: 'https://lumenscan.io',
    [networks.testnet]: 'https://testnet.lumenscan.io',
    ledgerUrl: 'ledgers',
    accountUrl: 'account',
    operationUrl: 'ops',
    transactionUrl: 'txns',
  },
  stellarchain: {
    [networks.mainnet]: 'https://stellarchain.io',
    [networks.testnet]: 'https://testnet.stellarchain.io',
    [networks.futurenet]: 'https://futurenet.stellarchain.io',
    ledgerUrl: 'ledgers',
    accountUrl: 'accounts',
    operationUrl: 'operations',
    transactionUrl: 'transactions',
  },
};

export default EXPLORERS;
