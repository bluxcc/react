import { IConnectParams, ISignParams } from '@creit.tech/xbull-wallet-connect';

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
interface FreighterApi {
  isConnected: () => Promise<{ isConnected: boolean }>;
  requestAccess: () => Promise<{ address: string }>;
  signTransaction: (
    transactionXdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
    },
  ) => Promise<{
    signedTxXdr: string;
    signerAddress: string;
  }>;
}

export type SignResult = {
  xdr: string;
  network: 'mainnet' | 'testnet';
};

export type ConnectResult = {
  publicKey: string;
};

declare global {
  interface Window {
    xBullSDK?: {
      connect(params?: IConnectParams): Promise<string>;
      sign(params: ISignParams): Promise<string>;
      closeConnections(): void;
    };
    freighterApiSDK?: FreighterApi;
    rabet?: {
      sign(xdr: string, network: 'mainnet' | 'testnet'): Promise<SignResult>;
      disconnect(): Promise<void>;
      connect: () => Promise<ConnectResult>;
      getNetwork: () => Promise<{ network: string; passphrase: string }>;
    };
  }
}

export {};
