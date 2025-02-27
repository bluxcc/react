import React, { useEffect, useState, useRef } from 'react';

import Button from '../../../components/Button';
import { useProvider } from '../../../context/provider';

import handleLogos from '../../../utils/handleLogos';
import getMappedWallets, { MappedWallet } from '../../../utils/mappedWallets';

import { Loading } from '../../../assets/Icons';
import { Routes, WalletInterface } from '../../../types';
import signTransaction from '../../../utils/stellar/signTransaction';

const Waiting = () => {
  const [error, setError] = useState(false);
  const [mappedWallets, setMappedWallets] = useState<MappedWallet[]>([]);
  const [matchedWallet, setMatchedWallet] = useState<WalletInterface | null>(null);
  const hasConnected = useRef(false);
  const context = useProvider();

  const waitingStatus = context.value.waitingStatus;
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

  const handleAssignment = async (wallet: WalletInterface) => {
    try {
      if (waitingStatus === 'signing') {
        const result = await signTransaction(
          wallet,
          xdr,
          context.value.user.wallet?.address as string,
          context.value.config.networkPassphrase,
        );

        if (resolver) resolver(result);

        context.setValue((prev) => ({
          ...prev,
          signTransaction: {
            ...prev.signTransaction,
            result: result,
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
        {handleLogos(user?.wallet?.name ?? '')}
      </div>

      <div className="space-y-1 flex-col text-center font-semibold">
        <p className="text-xl">
          {error
            ? `Failed ${waitingStatus === 'connecting' ? 'connecting to' : 'signing with'}`
            : `${waitingStatus === 'connecting' ? 'Waiting for' : 'Signing with'}`}{' '}
          {user?.wallet?.name}
        </p>
        <p className="text-sm">
          {error
            ? `Please try ${waitingStatus === 'connecting' ? 'connecting' : 'signing'} again.`
            : `${
                waitingStatus === 'connecting' ? 'Accept connection' : 'Sign the'
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
          {waitingStatus === 'connecting' ? 'Connecting' : 'Signing'}
        </Button>
      )}
    </div>
  );
};

export default Waiting;
