export interface UrlOptions {
  allowHttp?: boolean;
  appName?: string;
  appVersion?: string;
  authToken?: string;
  retryCount?: number;
  retryDelay?: number;
}

export interface Url extends UrlOptions {
  url: string;
}

export const url = (urlStr: string, options?: UrlOptions): Url => ({
  url: urlStr,
  ...options,
});
