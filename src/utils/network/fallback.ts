import { Url } from './url';

export interface FallbackOptions {
  retryCount?: number;
  retryDelay?: number;
}

export interface Fallback extends FallbackOptions {
  urls: Url[];
}

export const fallback = (urls: Url[], options?: FallbackOptions) => ({
  urls,
  ...options,
});
