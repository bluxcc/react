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
  const [matchedWallet, setMatchedWallet] = useState<WalletInterface | null>(
    null,
  );

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
          const passphrase = await getWalletNetwork(
            wallet,
            context.value.config.networks,
          );

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
    <div className="bluxcc-mt-4 bluxcc-flex bluxcc-w-full bluxcc-select-none bluxcc-flex-col bluxcc-items-center bluxcc-justify-center">
      <div
        className={`bluxcc-mb-6 bluxcc-flex bluxcc-h-20 bluxcc-w-20 bluxcc-items-center bluxcc-justify-center bluxcc-overflow-hidden bluxcc-rounded-full bluxcc-border-2 ${
          error ? 'bluxcc-border-lightRed-200' : 'bluxcc-border-primary-100'
        }`}
      >
        {handleLogos(user?.wallet?.name ?? '')}
      </div>

      <div className="bluxcc-flex-col bluxcc-space-y-1 bluxcc-text-center bluxcc-font-semibold">
        <p className="bluxcc-text-xl">
          {error
            ? `Failed ${waitingStatus === 'connecting' ? 'connecting to' : 'signing with'}`
            : `${waitingStatus === 'connecting' ? 'Waiting for' : 'Signing with'}`}{' '}
          {user?.wallet?.name}
        </p>
        <p className="bluxcc-text-sm">
          {error
            ? `Please try ${waitingStatus === 'connecting' ? 'connecting' : 'signing'} again.`
            : `${
                waitingStatus === 'connecting'
                  ? 'Accept connection'
                  : 'Sign the'
              } request in your wallet`}
        </p>
      </div>

      {/* divider */}
      <div className="bluxcc-flex bluxcc-h-8 bluxcc-w-full bluxcc-items-center bluxcc-justify-center">
        <div className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0 bluxcc-h-[1px] bluxcc-bg-primary-100" />
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
