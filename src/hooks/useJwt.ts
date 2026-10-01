import { useSyncExternalStore } from 'react';
import { getJwt, subscribeSession } from '@bluxcc/core';

/**
 * The signed-in user's session bearer token, held in memory by `@bluxcc/core`.
 *
 * Use this when a first-party app (the Blux dashboard) needs to call the Blux
 * API as the logged-in user. The token is not stored in `localStorage`. It is
 * `undefined` until login finishes, and again after logout or a reload.
 *
 * @returns The current JWT, or `undefined` when nobody is authenticated.
 *
 * @example
 * ```tsx
 * const jwt = useJwt();
 *
 * if (!jwt) {
 *   return null;
 * }
 * ```
 */
export const useJwt = (): string | undefined =>
  useSyncExternalStore(subscribeSession, getJwt, () => undefined);
