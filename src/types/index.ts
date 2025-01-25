export enum SupportedWallets {
  Rabet = 'Rabet',
  Albedo = 'Albedo',
  Freighter = 'Freighter',
  Xbull = 'xBull',
  Lobstr = 'LOBSTR',
}

export enum WalletNetwork {
  PUBLIC = 'Public Global Stellar Network ; September 2015',
  TESTNET = 'Test SDF Network ; September 2015',
  FUTURENET = 'Test SDF Future Network ; October 2022',
  SANDBOX = 'Local Sandbox Stellar Network ; September 2022',
  STANDALONE = 'Standalone Network ; February 2017',
}

export interface IProviderConfig {
  appName: string;
  networkPassphrase: string;
}

export interface IUser {
  wallet: {
    name: SupportedWallets | null;
    address: string | null;
  } | null;
}

export interface MergeConfigs {
  config: IProviderConfig;
  user: IUser;
  modal: {
    isOpen: boolean;
  };
  ready: boolean;
  isDemo: boolean;
  isAuthenticated: boolean;
  isConnecting: boolean;
}

export interface StateValue {
  value: MergeConfigs;
  setValue: React.Dispatch<React.SetStateAction<MergeConfigs>>;
}

export interface ConnectResult {
  publicKey: string;
}

export interface SignResult {
  signedXdr: string;
}

export enum networksEnum {
  PUBLIC = 'mainnet',
  TESTNET = 'testnet',
}

export interface WalletActions {
  name: SupportedWallets; // The name of the wallet
  website: string; // Official website or documentation link
  isAvailable: () => Promise<boolean> | boolean; // Checks if the wallet is available
  connect: () => Promise<{ publicKey: string }>; // Connects to the wallet and retrieves the public key
  getAddress?: (options?: { path?: string }) => Promise<{ address: string }>; // Fetches an address with optional path
  signTransaction?: (
    xdr: string,
    options?: {
      networkPassphrase?: string;
      address?: string;
      submit?: boolean;
    },
  ) => Promise<string>; // Signs a transaction XDR with optional parameters
  disconnect?: () => Promise<void>; // Disconnects from the wallet
  getNetwork?: () => Promise<{
    network: string;
    networkPassphrase: string;
  }>; // Retrieves network information
  signMessage?: (
    message: string,
    options?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
    },
  ) => Promise<{ signedMessage: string; signerPublicKey?: string }>; // Signs a message with optional parameters
  signAuthEntry?: (
    authorizationEntry: string,
    options?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
    },
  ) => Promise<{ signedAuthorizationEntry: string; signerPublicKey?: string }>; // Signs an authorization entry with optional parameters
}
