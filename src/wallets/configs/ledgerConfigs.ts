import { Buffer } from 'buffer';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Str from '@ledgerhq/hw-app-str';
import {
  GetNetworkResult,
  SupportedWallets,
  WalletInterface,
} from '../../types';
import { Keypair, StrKey, Transaction, xdr } from '@stellar/stellar-sdk';

(globalThis as any).Buffer = Buffer;

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}

export const ledgerConfig: WalletInterface = {
  name: SupportedWallets.Ledger,
  website: 'https://www.ledger.com',

  isAvailable: async () => {
    return true;
    // try {
    //   const devices = await TransportWebUSB.list();
    //   console.log('Ledger devices:', devices);
    //   return devices.length > 0;
    // } catch (error) {
    //   console.error('Error checking Ledger availability:', error);
    //   return false;
    // }
  },

  connect: async () => {
    try {
      const transport = await TransportWebUSB.create();
      const app = new Str(transport);
      const { rawPublicKey } = await app.getPublicKey("44'/148'/0'");
      const publicKey = StrKey.encodeEd25519PublicKey(rawPublicKey);
      console.log('Public Key:', publicKey);
      return { publicKey };
    } catch (error) {
      console.error('Error connecting to Ledger:', error);
      throw new Error('Failed to connect to Ledger.');
    }
  },

  signTransaction: async (xdrStr: string, options = {}): Promise<string> => {
    try {
      const tx = new Transaction(xdrStr, options.networkPassphrase);
      const transport = await TransportWebUSB.create();
      const app = new Str(transport);
      const { signature } = await app.signTransaction(
        "44'/148'/0'",
        tx.signatureBase(),
      );
      const keyPair = Keypair.fromPublicKey(options.address);
      const hint = keyPair.signatureHint();
      const decorated = new xdr.DecoratedSignature({
        hint,
        signature,
      });
      tx.signatures.push(decorated);
      return tx.toXDR();
    } catch (error) {
      console.error('Error signing transaction with Ledger:', error);
      throw new Error('Failed to sign the transaction with Ledger.');
    }
  },

  getNetwork: async (): Promise<GetNetworkResult> => {
    throw new Error('Failed to get network from ledger');
  },
};
