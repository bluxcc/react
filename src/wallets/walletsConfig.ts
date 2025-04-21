import { rabetConfig } from './configs/rabetConfig';
import { xBullConfig } from './configs/xbullConfig';
import { lobstrConfig } from './configs/lobstrConfig';
import { albedoConfig } from './configs/albedoConfig';
import { freighterConfig } from './configs/freighterConfig';
import { SupportedWallets, WalletInterface } from '../types';
import { HanaConfig } from './configs/hanaConfig';

export const walletsConfig: Record<SupportedWallets, WalletInterface> = {
  [SupportedWallets.Freighter]: freighterConfig,
  [SupportedWallets.Rabet]: rabetConfig,
  [SupportedWallets.Hana]: HanaConfig,
  [SupportedWallets.Lobstr]: lobstrConfig,
  [SupportedWallets.Albedo]: albedoConfig,
  [SupportedWallets.Xbull]: xBullConfig,
};
