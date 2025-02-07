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
  appLogo?: string;
  networkPassphrase: string;
  network: WalletNetwork;
}

export interface WalletInfo {
  name: SupportedWallets | null;
  address: string | null;
}

export interface IUser {
  wallet: WalletInfo | null;
}

export interface ContextState {
  value: ContextValues;
  setValue: React.Dispatch<React.SetStateAction<ContextValues>>;
}

export type SupportedFonts = 'Manrope' | 'Inter' | 'JetBrains Mono' | 'Roboto';

export type CornerRadius = 'none' | 'full' | 'sm' | 'md' | 'lg';

export interface IAppearance {
  theme: 'light' | 'dark';
  background: string;
  accent: string;
  textColor: string;
  font: SupportedFonts;
  cornerRadius: CornerRadius;
  cover: string;
}

export interface ContextValues {
  config: IProviderConfig;
  appearance: IAppearance;
  user: IUser;
  openModal: boolean;
  ready: boolean;
  isDemo: boolean;
  isAuthenticated: boolean;
  isConnecting: boolean;
}
export enum ModalView {
  CHOOSE_WALLET = 'CHOOSE_WALLET',
  CONNECTING = 'CONNECTING',
  PROFILE = 'PROFILE',
}

export interface ModalState {
  view: ModalView;
  showAllWallets: boolean;
}

export interface ModalHeights {
  [ModalView.PROFILE]: number;
  [ModalView.CONNECTING]: number;
  [ModalView.CHOOSE_WALLET]: number;
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
