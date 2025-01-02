import { SupportedWallets, WalletActions } from '../types';
import { albedoConfig } from './configs/albedoConfig';
import { freighterConfig } from './configs/freighterConfig';
import { lobstrConfig } from './configs/lobstrConfig';
import { rabetConfig } from './configs/rabetConfig';
import { xBullConfig } from './configs/xbullConfig';

export const useWalletConfigs = (): Record<SupportedWallets, WalletActions> => ({
  [SupportedWallets.Rabet]: rabetConfig,
  [SupportedWallets.Albedo]: albedoConfig,
  [SupportedWallets.Freighter]: freighterConfig,
  [SupportedWallets.Lobstr]: lobstrConfig,
  [SupportedWallets.Xbull]: xBullConfig,
});
