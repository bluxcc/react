import { rabetConfig } from './configs/rabetConfig';
import { xBullConfig } from './configs/xbullConfig';
import { lobstrConfig } from './configs/lobstrConfig';
import { albedoConfig } from './configs/albedoConfig';
import { freighterConfig } from './configs/freighterConfig';
import { SupportedWallets, WalletInterface } from '../types';

export const walletsConfig: Record<SupportedWallets, WalletInterface> = {
  [SupportedWallets.Freighter]: freighterConfig,
  [SupportedWallets.Rabet]: rabetConfig,
  [SupportedWallets.Albedo]: albedoConfig,
  [SupportedWallets.Xbull]: xBullConfig,
  [SupportedWallets.Lobstr]: lobstrConfig,
};
