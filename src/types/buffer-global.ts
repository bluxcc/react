declare global {
  interface Window {
    Buffer: typeof Buffer;
  }

  var Buffer: typeof import('buffer').Buffer;
}
(globalThis as any).Buffer = Buffer;

export {};
