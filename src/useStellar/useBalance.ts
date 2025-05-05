import { useEffect, useState } from 'react';
import { Asset } from '@stellar/stellar-sdk';

import useCheckProvider from '../hooks/useCheckProvider';
import useCustomNetwork from '../hooks/useCustomNetwork';

type UseBalanceParams = {
  address?: string;
  network?: string;
  asset?: string | Asset;
  // token?: string;
  // chainId?: number;
  // enabled?: boolean;
  // blockNumber?: number;
};

interface UseBalanceResult {
  balance: string;
  loading: boolean;
  error: Error | null;
}

const useBalance = ({ asset, address, network }: UseBalanceParams) => {
  const { value } = useCheckProvider();
  const { horizon, networkPassphrase } = useCustomNetwork(network);

  const [result, setResult] = useState<UseBalanceResult>({
    error: null,
    loading: true,
    balance: '0',
  });

  useEffect(() => {
    setResult({
      error: null,
      loading: true,
      balance: '0',
    });

    const userAddress = value.user.wallet?.address as string | undefined;

    if (!userAddress && !address) {
      setResult({
        loading: false,
        balance: '0',
        error: new Error(
          'Both user.wallet.address and address parameter are undefined',
        ),
      });

      return;
    }

    const finalAddress = (address ? address : userAddress) as string;

    horizon
      .loadAccount(finalAddress)
      .then((account) => {
        if (asset === 'native') {
          const nativeAsset = account.balances.find(
            (x) => x.asset_type === 'native',
          );

          setResult({
            error: null,
            loading: false,
            balance: nativeAsset?.balance || '0',
          });
        } else if (typeof asset === 'string') {
          const assetDetails = asset.split(':');

          const foundAsset = account.balances.find(
            (x) =>
              x.asset_code === assetDetails[0] &&
              x.asset_issuer === assetDetails[1],
          );

          setResult({
            error: null,
            loading: false,
            balance: foundAsset?.balance || '0',
          });
        }
      })
      .catch((err) => {
        setResult({
          error: err,
          loading: false,
          balance: '0',
        });
      });
  }, [address, asset, value.user.wallet, networkPassphrase]);

  return result;
};

export default useBalance;
