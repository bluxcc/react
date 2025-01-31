import React, { useContext, useEffect, useState, useRef } from 'react';
import { ProviderContext } from '../../../context/provider';
import { handleIcons } from '../../../utils/handleIcons';
import { Loading } from '../../../assets/Icons';
import Button from '../../../components/Button';
import { WalletActions } from '../../../types';
import { initializeRabetMobile } from '../../../utils/initializeRabetMobile';
import { mappedWallets } from '../../../utils/mappedWallets';

const Connecting = () => {
  const [error, setError] = useState(false);
  const hasConnected = useRef(false);
  const context = useContext(ProviderContext);

  const { user, isAuthenticated } = context?.value || {};
  const userWallet = user?.wallet;

  const matchedWallet = mappedWallets.find(
    ({ wallet }) => wallet.name === userWallet?.name,
  )?.wallet;

  useEffect(() => {
    if (!hasConnected.current && matchedWallet) {
      handleConnect(matchedWallet as WalletActions);
      hasConnected.current = true;
    }
  }, [matchedWallet, isAuthenticated]);

  const handleConnect = async (wallet: WalletActions) => {
    try {
      const { publicKey } = await wallet.connect();
      context?.setValue((prev) => ({
        ...prev,
        user: {
          wallet: {
            name: wallet.name,
            address: publicKey,
          },
        },
        isConnecting: false,
        isAuthenticated: true,
      }));
    } catch {
      context?.setValue((prev) => ({
        ...prev,
        isAuthenticated: false,
      }));
      setError(true);
    }
    initializeRabetMobile();
  };

  const handleRetry = () => {
    setError(false);
    handleConnect(matchedWallet as WalletActions);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full select-none mt-8">
      <div
        className={`h-20 w-20 flex justify-center border-2 rounded-full items-center mb-4 ${
          error ? ' border-red-600 ' : 'border-[#CDCEEE]'
        }`}
      >
        {handleIcons(user?.wallet?.name as string)}
      </div>
      <div className="space-y-3 flex-col text-center font-semibold">
        <p className="text-xl">
          {error ? 'Failed Connecting to' : 'Waiting for'} {user?.wallet?.name}
        </p>
        <p className="text-sm">
          {error ? 'Please try connecting again.' : 'Accept connection request in the wallet.'}
        </p>
      </div>
      {error ? (
        <Button
          onClick={handleRetry}
          className="mt-8 font-medium w-full inline-flex justify-center items-center gap-[10px] border-none text-white bg-red-600 rounded-full cursor-default"
        >
          Try again
        </Button>
      ) : (
        <Button
          disabled
          className="mt-8 font-medium w-full inline-flex justify-center items-center gap-[10px] border border-[#CDCEEE] rounded-full cursor-default"
        >
          <Loading />
          <p>Connecting</p>
        </Button>
      )}
    </div>
  );
};

export default Connecting;
