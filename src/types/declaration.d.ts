import { ConnectResult, SignResult, networksEnum } from './index';

declare module '*.svg' {
  const value: string;
  export default value;
}
declare module '*.png' {
  const value: string;
  export default value;
}

declare global {
  interface Window {
    rabet?: {
      sign(xdr: string, network: networksEnum): Promise<SignResult>;
      connect: () => Promise<ConnectResult>;
      disconnect(): Promise<void>;
    };
  }
}

export {};
