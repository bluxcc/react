import React, { useEffect, useState, useRef } from 'react';

import Button from '../../../components/Button';
import { useProvider } from '../../../context/provider';

import { handleIcons } from '../../../utils/handleIcons';
import { initializeRabetMobile } from '../../../utils/initializeRabetMobile';
import { getMappedWallets, MappedWallet } from '../../../utils/mappedWallets';

import { Loading } from '../../../assets/Icons';
import { Routes, WalletActions } from '../../../types';

const Connecting = () => {
  const [error, setError] = useState(false);
  const [mappedWallets, setMappedWallets] = useState<MappedWallet[]>([]);
  const [matchedWallet, setMatchedWallet] = useState<WalletActions | null>(null);
  const hasConnected = useRef(false);
  const context = useProvider();

  const { user } = context.value || {};
  const userWallet = user?.wallet;

  useEffect(() => {
    const fetchWallets = async () => {
      const wallets = await getMappedWallets();
      setMappedWallets(wallets);
    };
    fetchWallets();
  }, []);

  useEffect(() => {
    if (!userWallet?.name) return;

    const foundWallet = mappedWallets.find(({ wallet }) => wallet.name === userWallet.name)?.wallet;

    if (foundWallet) setMatchedWallet(foundWallet);
  }, [mappedWallets, userWallet]);

  useEffect(() => {
    if (!hasConnected.current && matchedWallet) {
      hasConnected.current = true;
      handleConnect(matchedWallet);
    }
  }, [matchedWallet]);

  const handleConnect = async (wallet: WalletActions) => {
    try {
      const { publicKey } = await wallet.connect();
      if (publicKey) {
        setTimeout(() => {
          context.setValue((prev) => ({
            ...prev,
            user: { wallet: { name: wallet.name, address: publicKey } },
          }));
          context.setRoute(Routes.CONNECT_SUCCESS);
        }, 400);
      }
    } catch {
      setError(true);
    }
    initializeRabetMobile();
  };

  const handleRetry = () => {
    setError(false);
    if (matchedWallet) handleConnect(matchedWallet);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full select-none mt-4">
      <div
        className={`h-20 w-20 flex justify-center border-2 rounded-full overflow-hidden items-center mb-6 ${
          error ? 'border-lightRed-200' : 'border-primary-100'
        }`}
      >
        {handleIcons(user?.wallet?.name ?? '')}
      </div>

      <div className="space-y-1 flex-col text-center font-semibold">
        <p className="text-xl">
          {error ? 'Failed connecting to' : 'Waiting for'} {user?.wallet?.name}
        </p>
        <p className="text-sm">
          {error ? 'Please try connecting again.' : 'Accept connection request in the wallet.'}
        </p>
      </div>

      {/* divider */}
      <div className="w-full my-4">
        <div className="absolute left-0 right-0 bg-primary-100 h-[1px]" />
      </div>

      {error ? (
        <Button onClick={handleRetry} className="text-white bg-lightRed-300 hover:text-primary-500">
          Try again
        </Button>
      ) : (
        <Button state="enabled" variant="outline" startIcon={<Loading />}>
          <p>Connecting</p>
        </Button>
      )}
    </div>
  );
};

export default Connecting;
