import { useState, useEffect } from 'react';
import { Horizon } from '@stellar/stellar-sdk';

import getNetworkByPassphrase from '../utils/stellar/getNetworkByPassphrase';
import getStellarServer from '../utils/stellar/getStellarServer';

import { AccountData } from '../types';
import { getTransactions } from '../utils/stellar/getTransactions';

type HorizonServer = Horizon.Server;

interface AccountHookResult {
  account: AccountData | null;
  loading: boolean;
  error: string | null;
}

interface AccountHookProps {
  publicKey: string;
  passphrase: string;
}

const getXLMBalance = (balances: Horizon.HorizonApi.BalanceLine[]): string => {
  return balances.find((b) => b.asset_type === 'native')?.balance || '0';
};

const useAccount = ({
  publicKey,
  passphrase,
}: AccountHookProps): AccountHookResult => {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    let eventSource: (() => void) | null = null;
    getTransactions(
      new Horizon.Server('https://horizon.stellar.org'),
      publicKey,
    ).then((res) => {
        // TODO: fix the typing
        console.log(res);
      // setAccount((prev) => (prev ? { ...prev, transactions: res } : null));
    });
    // todo fix network
    const fetchAccount = async (server: HorizonServer) => {
      try {
        const accountData = await server.loadAccount(publicKey);
        if (!isSubscribed) return;

        setAccount((prev) => ({
          id: accountData.id,
          sequence: accountData.sequence,
          subentry_count: accountData.subentry_count,
          thresholds: accountData.thresholds,
          balances: accountData.balances,
          xlmBalance: getXLMBalance(accountData.balances),
          transactions: prev?.transactions,
        }));

        setError(null);
      } catch (err) {
        if (isSubscribed && !error) {
          setError((err as Error).message);
          setAccount(null);
        }
      }
    };

    const initializeAccount = async () => {
      if (!publicKey) {
        setError('No public key provided');
        setLoading(false);
        return;
      }

      try {
        const server = getStellarServer(
          getNetworkByPassphrase(passphrase) as
            | 'testnet'
            | 'public'
            | 'futurenet',
        );
        setLoading(true);

        await Promise.all([fetchAccount(server)]);
        eventSource = server
          .operations()
          .forAccount(publicKey)
          .cursor('now')
          .stream({
            onmessage: () => fetchAccount(server),
            onerror: (err) => {
              if (isSubscribed && !error) {
                setError((err as MessageEvent).data.message);
              }
            },
          });
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    initializeAccount();

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (eventSource) {
        eventSource();
      }
    };
  }, [publicKey, passphrase]);

  return { account, loading, error };
};

export default useAccount;
