declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare global {
  interface Window {
    xBullSDK?: any;
    rabet?: {
      sign(xdr: string, network: networksEnum): Promise<SignResult>;
      connect: () => Promise<ConnectResult>;
      disconnect(): Promise<void>;
    };
  }
}

export {};
