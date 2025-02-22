import { SupportedWallets, WalletInterface } from '../types';
import { albedoConfig } from './configs/albedoConfig';
import { freighterConfig } from './configs/freighterConfig';
import { lobstrConfig } from './configs/lobstrConfig';
import { rabetConfig } from './configs/rabetConfig';
import { xBullConfig } from './configs/xbullConfig';

export const walletsConfig: Record<SupportedWallets, WalletInterface> = {
  [SupportedWallets.Freighter]: freighterConfig,
  [SupportedWallets.Rabet]: rabetConfig,
  [SupportedWallets.Xbull]: xBullConfig,
  [SupportedWallets.Albedo]: albedoConfig,
  [SupportedWallets.Lobstr]: lobstrConfig,
};
