import { useState, useEffect } from 'react';
import { Horizon } from '@stellar/stellar-sdk';
import { WalletNetwork } from '../types';
import { getNetworkByPassphrase } from '../utils/getNetworkByPassphrase';

const HORIZON_SERVERS: Record<string, string> = {
  public: 'https://horizon.stellar.org',
  testnet: 'https://horizon-testnet.stellar.org',
  futurenet: 'https://horizon-futurenet.stellar.org',
};

const useAccount = (publicKey: string, passphrase: string) => {
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let network: WalletNetwork;
  try {
    network = getNetworkByPassphrase(passphrase);
  } catch (err: any) {
    return { account: null, loading: false, error: err.message };
  }

  const server = new Horizon.Server(HORIZON_SERVERS[network]);

  useEffect(() => {
    if (!publicKey) {
      setError('No public key provided');
      setLoading(false);
      return;
    }

    const fetchAccount = async () => {
      setLoading(true);
      try {
        const accountData = await server.loadAccount(publicKey);
        const xlmBalance =
          accountData.balances.find((b) => b.asset_type === 'native')?.balance || '0';

        setAccount({
          id: accountData.id,
          sequence: accountData.sequence,
          subentry_count: accountData.subentry_count,
          thresholds: accountData.thresholds,
          balances: accountData.balances,
          xlmBalance,
        });

        setError(null);
      } catch (err: any) {
        setError(err.message);
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();

    const es = server
      .operations()
      .forAccount(publicKey)
      .cursor('now')
      .stream({
        onmessage: fetchAccount,
        onerror: (err: any) => setError(err.message),
      });

    return () => es();
  }, [publicKey, passphrase]);

  return { account, loading, error };
};

export default useAccount;
