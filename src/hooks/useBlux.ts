import { useEffect, useState } from 'react';
import { blux, useExportedStore } from '@bluxcc/core';

/**
 * The primary wallet/session hook: returns the live `blux` instance and
 * re-renders when the connected user or auth state changes.
 *
 * Use it to drive authentication and signing from the UI. The returned object
 * exposes session actions (`login`, `logout`, `fundMe`, `profile`), signing and
 * submission (`signTransaction`, `signMessage`, `signAuthEntry`,
 * `sendTransaction`), and reactive state (`user`, `isAuthenticated`, `isReady`).
 *
 * @returns The reactive `blux` instance.
 *
 * @example
 * ```tsx
 * const blux = useBlux();
 *
 * if (!blux.isAuthenticated) {
 *   return <button onClick={() => blux.login()}>Connect wallet</button>;
 * }
 * return (
 *   <>
 *     <span>{blux.user?.address}</span>
 *     <button onClick={() => blux.logout()}>Disconnect</button>
 *   </>
 * );
 * ```
 */
export const useBlux = () => {
  const [bluxState, setBluxState] = useState(blux);
  const user = useExportedStore((state) => state.user);
  const authState = useExportedStore((state) => state.authState);

  useEffect(() => {
    setBluxState(blux);
  }, [user, authState]);

  return bluxState;
};
