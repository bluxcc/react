import React, { useEffect, useState, useRef } from 'react';

import Button from '../../../components/Button';
import { Loading } from '../../../assets/Icons';
import handleLogos from '../../../utils/handleLogos';
import { useProvider } from '../../../context/provider';
import { Routes, WalletInterface } from '../../../types';
import getWalletNetwork from '../../../utils/getWalletNetwork';
import signTransaction from '../../../utils/stellar/signTransaction';
import getMappedWallets, { MappedWallet } from '../../../utils/mappedWallets';

const Waiting = () => {
  const context = useProvider();
  const hasConnected = useRef(false);
  const [error, setError] = useState(false);
  const [mappedWallets, setMappedWallets] = useState<MappedWallet[]>([]);
  const [matchedWallet, setMatchedWallet] = useState<WalletInterface | null>(null);

  const { user } = context.value || {};
  const waitingStatus = context.value.waitingStatus;
  const { xdr, resolver } = context.value.signTransaction;

  const fetchWallets = async () => {
    const wallets = await getMappedWallets();

    setMappedWallets(wallets);
  };

  useEffect(() => {
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
          context.value.config.networks[0], // todo: fix network
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
          const passphrase = await getWalletNetwork(wallet, context.value.config.networks);

          context.setValue((prev) => ({
            ...prev,
            user: {
              ...prev.user,
              wallet: {
                passphrase,
                name: wallet.name,
                address: publicKey,
              },
            },
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
      <div className="w-full flex justify-center items-center h-8">
        <div className="absolute left-0 right-0 bg-primary-100 h-[1px]" />
      </div>

      {error ? (
        <Button onClick={handleRetry} state="enabled" variant="outline">
          Try again
        </Button>
      ) : (
        <Button
          state="enabled"
          variant="outline"
          startIcon={<Loading fill={context.value.config.appearance.accent} />}
        >
          {waitingStatus === 'connecting' ? 'Connecting' : 'Signing'}
        </Button>
      )}
    </div>
  );
};

export default Waiting;
