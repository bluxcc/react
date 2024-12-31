// Albedo
import albedo from '@albedo-link/intent';

// Freighter
import freighterApi, { signTransaction as freighterSignTransaction } from '@stellar/freighter-api';

// Lobstr
import {
  isConnected as lobstrIsConnected,
  getPublicKey as lobstrGetPublicKey,
  signTransaction as lobstrSignTransaction,
} from '@lobstrco/signer-extension-api';

// xBull
import { xBullWalletConnect } from '@creit.tech/xbull-wallet-connect';

import { RabetIcon, AlbedoIcon, LobstrIcon, FreighterIcon, XBullIcon } from '../assets/walletsLogo';

import { networksEnum, SupportedWallets, WalletActions, WalletNetwork } from '../types';

const isBrowser = typeof window !== 'undefined';

export const walletConfigs: Record<SupportedWallets, WalletActions> = {
  rabet: {
    name: 'Rabet',
    icon: RabetIcon,
    website: 'https://rabet.io',
    isAvailable: async () => isBrowser && !!window.rabet,
    connect: async () => {
      if (!window.rabet) throw new Error('Rabet Wallet is not installed.');
      const result = await window.rabet.connect();
      return { publicKey: result.publicKey };
    },
    signTransaction: async (xdr: string, options = {}) => {
      if (!window.rabet) throw new Error('Rabet Wallet is not installed.');
      const result = await window.rabet.sign(
        xdr,
        options.networkPassphrase === WalletNetwork.PUBLIC
          ? networksEnum.PUBLIC
          : networksEnum.TESTNET,
      );
      return result.signedXdr;
    },
    disconnect: async () => {
      if (!window.rabet) throw new Error('Rabet Wallet is not installed.');
      window.rabet.disconnect();
    },
  },
  albedo: {
    name: 'Albedo',
    icon: AlbedoIcon,
    website: 'https://albedo.link',
    isAvailable: async () => true,
    connect: async () => {
      const result = await albedo.publicKey({ token: 'Connect to Albedo' });
      return { publicKey: result.pubkey };
    },
    signTransaction: async (xdr: string, options = {}) => {
      const result = await albedo.tx({
        xdr,
        pubkey: options?.address,
        network:
          options.networkPassphrase === WalletNetwork.PUBLIC
            ? networksEnum.PUBLIC
            : networksEnum.TESTNET,
        submit: options?.submit,
      });
      return result.signed_envelope_xdr;
    },
  },
  lobstr: {
    name: 'LOBSTR',
    icon: LobstrIcon,
    website: 'https://lobstr.co',
    isAvailable: async () => isBrowser && !!(await lobstrIsConnected()),
    connect: async () => {
      if (!(await lobstrIsConnected())) {
        throw new Error('LOBSTR Wallet is not installed or connected.');
      }
      const publicKey = await lobstrGetPublicKey();
      return { publicKey };
    },
    signTransaction: async (xdr: string) => {
      if (!lobstrSignTransaction) {
        throw new Error('LOBSTR Wallet does not support signing transactions.');
      }
      return await lobstrSignTransaction(xdr);
    },
  },
  xbull: {
    name: 'xBull',
    icon: XBullIcon,
    website: 'https://xbull.app',
    isAvailable: async () => true,
    connect: async () => {
      const bridge = new xBullWalletConnect();
      const publicKey = await bridge.connect();
      bridge.closeConnections();
      return { publicKey };
    },
    signTransaction: async (xdr: string, options = {}) => {
      const bridge = new xBullWalletConnect();
      const signedXdr = await bridge.sign({
        xdr,
        publicKey: options?.address,
        network: options?.networkPassphrase,
      });
      bridge.closeConnections();
      return signedXdr;
    },
  },
  freighter: {
    name: 'Freighter',
    icon: FreighterIcon,
    website: 'https://freighter.app',
    isAvailable: async () => isBrowser && !!(await freighterApi.isConnected()),
    connect: async () => {
      if (!(await freighterApi.isConnected())) {
        throw new Error('Freighter Wallet is not installed or connected.');
      }
      const result = await freighterApi.requestAccess();
      return { publicKey: result.address };
    },
    signTransaction: async (xdr: string, options = {}) => {
      const result = await freighterSignTransaction(xdr, {
        address: options?.address,
        networkPassphrase: options?.networkPassphrase,
      });
      return result.signedTxXdr;
    },
  },
};
