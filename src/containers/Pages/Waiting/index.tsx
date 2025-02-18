import React, { useEffect, useState, useRef } from 'react';

import Button from '../../../components/Button';
import { useProvider } from '../../../context/provider';

import { handleIcons } from '../../../utils/handleIcons';
import { getMappedWallets, MappedWallet } from '../../../utils/mappedWallets';

import { Loading } from '../../../assets/Icons';
import { Routes, WalletActions } from '../../../types';
import { signTransactionHandler } from '../../../utils/signTransactionHandler';

const Waiting = () => {
  const [error, setError] = useState(false);
  const [mappedWallets, setMappedWallets] = useState<MappedWallet[]>([]);
  const [matchedWallet, setMatchedWallet] = useState<WalletActions | null>(null);
  const hasConnected = useRef(false);
  const context = useProvider();

  const modalState = context.value.modalState;
  const { user } = context.value || {};
  const { xdr, resolver } = context.value.signTransaction;

  useEffect(() => {
    const fetchWallets = async () => {
      const wallets = await getMappedWallets();
      setMappedWallets(wallets);
    };
    fetchWallets();
  }, []);

  useEffect(() => {
    if (!user?.wallet?.name) return;

    const foundWallet = mappedWallets.find(
      ({ wallet }) => wallet.name === user?.wallet?.name,
    )?.wallet;

    if (foundWallet) setMatchedWallet(foundWallet);
  }, [mappedWallets, user?.wallet]);

  useEffect(() => {
    if (!hasConnected.current && matchedWallet) {
      hasConnected.current = true;
      handleAssignment(matchedWallet);
    }
  }, [matchedWallet]);

  const handleAssignment = async (wallet: WalletActions) => {
    try {
      if (modalState === 'signing') {
        const result = await signTransactionHandler(
          wallet,
          xdr,
          context.value.user.wallet?.address as string,
          context.value.config.networkPassphrase,
          resolver,
        );

        context.setValue((prev) => ({
          ...prev,
          signTransaction: {
            ...prev.signTransaction,
            latestResults: result,
          },
        }));

        if (result) {
          context.setRoute(Routes.SUCCESSFUL);
        } else {
          setError(true);
        }
      } else {
        const { publicKey } = await wallet.connect();

        if (publicKey && publicKey.trim() !== '') {
          context.setValue((prev) => ({
            ...prev,
            user: { wallet: { name: wallet.name, address: publicKey } },
          }));

          setTimeout(() => {
            context.setRoute(Routes.SUCCESSFUL);
          }, 400);
        }
      }
    } catch (error) {
      setError(true);
      throw error;
    }
  };

  const handleRetry = () => {
    setError(false);
    if (matchedWallet) handleAssignment(matchedWallet);
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
          {error
            ? `Failed ${modalState === 'connecting' ? 'connecting to' : 'signing with'}`
            : `${modalState === 'connecting' ? 'Waiting for' : 'Signing with'}`}{' '}
          {user?.wallet?.name}
        </p>
        <p className="text-sm">
          {error
            ? `Please try ${modalState === 'connecting' ? 'connecting' : 'signing'} again.`
            : `${
                modalState === 'connecting' ? 'Accept connection' : 'Sign the'
              } request in your wallet`}
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
          {modalState === 'connecting' ? 'Connecting' : 'Signing'}
        </Button>
      )}
    </div>
  );
};

export default Waiting;
