import { useSyncExternalStore } from 'react';
import { getJwt, subscribeSession } from '@bluxcc/core';

/**
 * The signed-in user's session bearer token, managed by `@bluxcc/core`.
 *
 * Use this when a first-party app (the Blux dashboard) needs to call the Blux
 * API as the logged-in user. Accepted sessions persist in `localStorage`.
 * This is `undefined` until login or saved-session validation finishes, and
 * again after logout. Page scripts can read the persisted bearer token.
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
