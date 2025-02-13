/**
 * Enum representing the supported wallets in the system.
 */
export enum SupportedWallets {
  Rabet = 'Rabet',
  Albedo = 'Albedo',
  Freighter = 'Freighter',
  Xbull = 'xBull',
  Lobstr = 'LOBSTR',
}

/**
 * Enum defining the various Stellar network environments.
 */
export enum WalletNetwork {
  PUBLIC = 'Public Global Stellar Network ; September 2015',
  TESTNET = 'Test SDF Network ; September 2015',
  FUTURENET = 'Test SDF Future Network ; October 2022',
  SANDBOX = 'Local Sandbox Stellar Network ; September 2022',
  STANDALONE = 'Standalone Network ; February 2017',
}

/**
 * Configuration options for the provider.
 */
export interface IProviderConfig {
  appName: string; // Application name
  appLogo?: string; // Optional application logo URL
  networkPassphrase: string; // Stellar network passphrase
  network: 'mainnet' | 'testnet' | 'futurenet' | 'sandbox' | 'standalone'; // Supported network types
}

/**
 * Information about the connected wallet.
 */
export interface WalletInfo {
  name: SupportedWallets | null; // Wallet name, if connected
  address: string | null; // Wallet public address, if connected
}

/**
 * User-related information within the context.
 */
export interface IUser {
  wallet: WalletInfo | null; // The user's connected wallet details
}

/**
 * Context state management interface.
 */
export interface ContextState {
  value: ContextValues; // Current context values
  setValue: React.Dispatch<React.SetStateAction<ContextValues>>; // Function to update context values
}

/**
 * Supported font options for UI customization.
 */
export type SupportedFonts = 'Manrope' | 'Inter' | 'JetBrains Mono' | 'Lora';

/**
 * Supported corner radius styles for UI elements.
 */
export type CornerRadius = 'none' | 'full' | 'sm' | 'md' | 'lg';

/**
 * Appearance customization options.
 */
export interface IAppearance {
  theme: 'light' | 'dark'; // Light or dark mode
  background: string; // Background color or image
  accent: string; // Primary accent color
  textColor: string; // Main text color
  font: SupportedFonts; // Selected font style
  cornerRadius: CornerRadius; // Border radius styling
  cover: string; // Cover image or color for UI components
}

/**
 * Structure of the global context values.
 */
export interface ContextValues {
  config: IProviderConfig; // Provider configuration
  appearance: IAppearance; // UI appearance settings
  user: IUser; // User-related information
  openModal: boolean; // Determines if the modal is open
  isReady: boolean; // Indicates if the system is ready
  isDemo: boolean; // Specifies if in demo mode
  isAuthenticated: boolean; // User authentication status
  isConnecting: boolean; // Connection state flag
  connectRejected: boolean; // Indicates if the connection was rejected
  availableWallets: WalletActions[]; // List of available wallets
  connectSuccess: boolean; // Indicates if the connection was successful
  signTx: boolean; // Indicates if sign transaction modal should open
}

/**
 * Enum defining different modal views.
 */
export enum ModalView {
  ONBOARDING = 'ONBOARDING', // View for selecting a wallet
  CONNECTING = 'CONNECTING', // View for connection process
  CONNECT_SUCCESS = 'CONNECT_SUCCESS', // View for connection success process
  PROFILE = 'PROFILE', // User profile view
  SIGN_TRANSACTION = 'SIGN_TRANSACTION', // User sign transaction view
}

/**
 * Modal state management interface.
 */
export interface ModalState {
  view: ModalView; // Current modal view
  showAllWallets: boolean; // Whether to display all available wallets
}

/**
 * Defines the heights for different modal views.
 */
export interface ModalHeights {
  [ModalView.PROFILE]: number;
  [ModalView.CONNECTING]: number;
  [ModalView.ONBOARDING]: number;
  [ModalView.CONNECT_SUCCESS]: number;
  [ModalView.SIGN_TRANSACTION]: number;
}

/**
 * Represents the result of a successful wallet connection.
 */
export interface ConnectResult {
  publicKey: string; // Public key obtained after connection
}

/**
 * Represents the result of a signed transaction.
 */
export interface SignResult {
  signedXdr: string; // Signed XDR transaction string
}

/**
 * Defines the available actions for interacting with a wallet.
 */
export interface WalletActions {
  name: SupportedWallets; // Name of the wallet
  website: string; // Official wallet website or documentation URL
  isAvailable: () => Promise<boolean> | boolean; // Checks wallet availability
  connect: () => Promise<{ publicKey: string }>; // Initiates wallet connection
  getAddress?: (options?: { path?: string }) => Promise<{ address: string }>; // Retrieves wallet address with optional path
  signTransaction?: (
    xdr: string,
    options?: {
      networkPassphrase?: string;
      address?: string;
      submit?: boolean;
    },
  ) => Promise<string>; // Signs a transaction with optional parameters
  disconnect?: () => Promise<void>; // Disconnects the wallet session
  getNetwork?: () => Promise<{
    network: string;
    networkPassphrase: string;
  }>; // Retrieves network information from the wallet
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
