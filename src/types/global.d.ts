declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
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
