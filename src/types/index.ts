import { Horizon, rpc } from '@stellar/stellar-sdk';
import { HorizonApi } from '@stellar/stellar-sdk/lib/horizon';

import { Url } from '../utils/network/url';
import { UseAccountResult } from '../useStellar/useAccount';
import { LanguageKey } from '../constants/locales';

/**
 * Enum representing the supported wallets in the system.
 */
export enum SupportedWallets {
  Rabet = 'Rabet',
  Albedo = 'Albedo',
  Freighter = 'Freighter',
  Xbull = 'xBull',
  Lobstr = 'LOBSTR',
  Hana = 'Hana',
  Hot = 'Hot',
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
  xlmBalance: string;
  subentry_count: number;
  balances: Horizon.HorizonApi.BalanceLine[];
  thresholds: Horizon.HorizonApi.AccountThresholds;
  transactions?: Horizon.ServerApi.TransactionRecord[];
}

export interface IAsset {
  logo?: string;
  balance: string;
  assetCode: string;
  assetType: string;
  assetIssuer: string;
}

interface IServers {
  horizon: Url;
  soroban: Url;
}

export type ITransports = Record<string, IServers>;

export type IExplorers =
  | 'steexp'
  | 'stellarchain'
  | 'stellarexpert'
  | 'lumenscan';

/**
 *  BluxProvider.config
 */
export interface IProviderConfig {
  appName: string; // Application name
  networks: string[]; // Supported network passphrases
  defaultNetwork: string; // The default network passphrase
  appearance?: Partial<IAppearance>;
  transports?: ITransports;
  explorer?: IExplorers;
  lang?: LanguageKey;
  showWalletUIs?: boolean;
  loginMethods?: Array<
    'wallet' | 'email' | 'google' | 'twitter' | 'discord' | 'github' | 'passkey'
  >;
}

/**
 *  context.value.config
 *  Appearance will be set to default values if the user does not provider appearance (or provides some of the values in Appearance)
 */
export interface IConfig extends IProviderConfig {
  explorer: IExplorers;
  appearance: IAppearance;
  showWalletUIs: boolean;
}

export type CheckedWallet = {
  wallet: WalletInterface;
  isAvailable: boolean;
  isRecent?: boolean;
};

/**
 * Information about the connected wallet.
 */
export interface WalletInfo {
  passphrase: string;
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
 * Appearance customization options.
 */
export interface IAppearance {
  theme: 'light' | 'dark'; // Light or dark mode
  background: string; // Background color or image
  bgField: string; // Background color for input fields or similar UI areas
  accent: string; // Primary accent color
  textColor: string; // Main text color
  font: string; // Selected font family or style
  borderRadius: string; // Border radius for UI elements
  borderColor: string; // Border color for elements
  borderWidth: string; // Width of borders (e.g., '1px', '0', etc.)
  includeBorders: boolean; // Whether to display borders using the specified borderWidth
  logo?: React.ImgHTMLAttributes<HTMLImageElement>['src']; // Optional application logo URL
}

/**
 * Structure of the global context values.
 */
export interface ContextInterface {
  config: IConfig; // Provider configuration
  user: IUser; // User-related information
  isModalOpen: boolean; // Determines if the modal is open
  isReady: boolean; // Indicates if the system is ready
  isDemo: boolean; // Specifies if in demo mode
  isAuthenticated: boolean; // User authentication status
  availableWallets: CheckedWallet[]; // List of available wallets
  waitingStatus: 'connecting' | 'signing';
  showAllWallets: boolean; // Flag to show all wallets in the onboarding process
  activeNetwork: string;
  account: UseAccountResult;
  signTransaction: ISignTransaction<boolean>;
  servers: {
    horizon: Horizon.Server;
    soroban: rpc.Server;
  };
}

/**
 * Enum defining different modal views.
 */
export enum Routes {
  ONBOARDING = 'ONBOARDING', // View for selecting a wallet
  WRONG_NETWORK = 'WRONG_NETWORK', // View for selecting a wallet
  WAITING = 'WAITING', // View for connection process
  SUCCESSFUL = 'SUCCESSFUL', // View for connection success process
  PROFILE = 'PROFILE', // User profile view
  SIGN_TRANSACTION = 'SIGN_TRANSACTION', // User sign transaction view
  SEND = 'SEND', // User sign transaction view
  ACTIVITY = 'ACTIVITY', // User sign transaction view
  OTP = 'OTP', // User Login with Phone ot email
  RECEIVE = 'RECEIVE', // View for receive page
  BALANCES = 'BALANCES', // View for balances
  SWAP = 'SWAP', // View for swap assets
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

export interface GetNetworkResult {
  network: string;
  passphrase: string;
}

export interface ISendTransactionOptions {
  network?: string;
  isSoroban?: boolean;
}

export type ISendTransactionOptionsInternal = {
  network: string;
  isSoroban: boolean;
};

export type TransactionResponseType<T extends boolean> = T extends true
  ? rpc.Api.GetSuccessfulTransactionResponse
  : HorizonApi.SubmitTransactionResponse;

// Use the generic type parameter to ensure consistency
export interface ISignTransaction<IsSoroban extends boolean> {
  options: ISendTransactionOptionsInternal;
  xdr: string; // Transaction details for signing
  rejecter: ((reason: any) => void) | null; // Transaction signing rejecter
  result: TransactionResponseType<IsSoroban> | null; // Conditional response type
  resolver: ((value: TransactionResponseType<IsSoroban>) => void) | null; // Resolver with matching type
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
  getNetwork: () => Promise<{
    network: string;
    passphrase: string;
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
