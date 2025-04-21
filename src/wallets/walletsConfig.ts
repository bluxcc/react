import { rabetConfig } from './configs/rabetConfig';
import { xBullConfig } from './configs/xbullConfig';
import { lobstrConfig } from './configs/lobstrConfig';
import { albedoConfig } from './configs/albedoConfig';
import { ledgerConfig } from './configs/ledgerConfigs';
import { freighterConfig } from './configs/freighterConfig';
import { SupportedWallets, WalletInterface } from '../types';

export const walletsConfig: Record<SupportedWallets, WalletInterface> = {
  [SupportedWallets.Freighter]: freighterConfig,
  [SupportedWallets.Ledger]: ledgerConfig,
  [SupportedWallets.Rabet]: rabetConfig,
  [SupportedWallets.Albedo]: albedoConfig,
  [SupportedWallets.Lobstr]: lobstrConfig,
  [SupportedWallets.Xbull]: xBullConfig,
};
