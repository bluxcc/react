import { Horizon } from '@stellar/stellar-sdk';
import { HorizonApi } from '@stellar/stellar-sdk/lib/horizon';

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

export interface AccountData {
  id: string;
  sequence: string;
  subentry_count: number;
  thresholds: Horizon.HorizonApi.AccountThresholds;
  balances: Horizon.HorizonApi.BalanceLine[];
  xlmBalance: string;
  transactions?: Horizon.ServerApi.TransactionRecord[];
}

interface IServers {
  horizon?: string;
  soroban?: string;
}

export type ITransports = Record<string, IServers>;

/**
 * Configuration options for the provider.
 */
export interface IProviderConfig {
  appName: string; // Application name
  appLogo?: string; // Optional application logo URL
  networks: string[]; // Supported network pass phrases
  transports?: ITransports;
}

/**
 * Information about the connected wallet.
 */
export interface WalletInfo {
  name: SupportedWallets; // Wallet name, if connected
  address: string | null; // Wallet public address, if connected
}

/**
 * User-related information within the context.
 */
export interface IUser {
  wallet: WalletInfo | null; // The user's connected wallet details
  email: string | null; // User email address
  phoneNumber: number | null; // User phone number
}

/**
 * Context state management interface.
 */
export interface ContextState {
  value: ContextInterface; // Current context values
  setValue: React.Dispatch<React.SetStateAction<ContextInterface>>; // Function to update context values
  route: Routes;
  setRoute: React.Dispatch<React.SetStateAction<Routes>>;
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
export interface ContextInterface {
  config: IProviderConfig; // Provider configuration
  appearance: IAppearance; // UI appearance settings
  user: IUser; // User-related information
  isModalOpen: boolean; // Determines if the modal is open
  isReady: boolean; // Indicates if the system is ready
  isDemo: boolean; // Specifies if in demo mode
  isAuthenticated: boolean; // User authentication status
  availableWallets: WalletInterface[]; // List of available wallets
  waitingStatus: 'connecting' | 'signing';
  signTransaction: {
    xdr: string; // Transaction details for signing
    resolver: ((value: HorizonApi.SubmitTransactionResponse) => void) | null; // Transaction signing resolver
    result: HorizonApi.SubmitTransactionResponse | null; // Latest transaction signing result
  };
}

/**
 * Enum defining different modal views.
 */
export enum Routes {
  ONBOARDING = 'ONBOARDING', // View for selecting a wallet
  WAITING = 'WAITING', // View for connection process
  SUCCESSFUL = 'SUCCESSFUL', // View for connection success process
  PROFILE = 'PROFILE', // User profile view
  SIGN_TRANSACTION = 'SIGN_TRANSACTION', // User sign transaction view
  SEND = 'SEND', // User sign transaction view
  ACTIVITY = 'ACTIVITY', // User sign transaction view
  OTP = 'OTP', // User Login with Phone ot email
}

/**
 * Modal state management interface.
 */
export interface ModalRoute {
  route: Routes; // Current modal view
  showAllWallets: boolean; // Whether to display all available wallets
}

/**
 * Defines the heights for different modal views.
 */
export interface ModalHeights {
  [Routes.PROFILE]: number;
  [Routes.WAITING]: number;
  [Routes.ONBOARDING]: number;
  [Routes.SUCCESSFUL]: number;
  [Routes.SIGN_TRANSACTION]: number;
  [Routes.SEND]: number;
  [Routes.ACTIVITY]: number;
  [Routes.OTP]: number;
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
export interface WalletInterface {
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
