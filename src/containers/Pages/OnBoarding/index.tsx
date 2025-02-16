import React, { useContext, useEffect, useState, useMemo } from 'react';

import { ProviderContext } from '../../../context/provider';

import CardItem from '../../../components/CardItem';
import { handleIcons } from '../../../utils/handleIcons';
import { getMappedWallets } from '../../../utils/mappedWallets';

import { WalletActions } from '../../../types';
import BluxLogo from '../../../assets/bluxLogo';
import { StellarIcon } from '../../../assets/logos';

type OnBoardingProps = {
  showAllWallets: boolean;
  setShowAllWallets: (value: boolean) => void;
};

const OnBoarding = ({ showAllWallets, setShowAllWallets }: OnBoardingProps) => {
  const context = useContext(ProviderContext);
  const [wallets, setWallets] = useState<WalletActions[]>(context?.value.availableWallets || []);

  const hiddenWallets = useMemo(() => {
    return wallets.length > 3 ? wallets.slice(2) : [];
  }, [wallets]);

  const visibleWallets = useMemo(() => {
    return showAllWallets ? wallets.slice(2) : wallets.slice(0, 2);
  }, [wallets, showAllWallets]);

  useEffect(() => {
    if (wallets.length > 0) return;

    const loadWallets = async () => {
      const mappedWallets = await getMappedWallets();
      const available = mappedWallets
        .filter(({ isAvailable }) => isAvailable)
        .map(({ wallet }) => wallet);

      setWallets(available);
      context?.setValue((prev) => ({
        ...prev,
        availableWallets: available,
        isReady: true,
      }));
    };

    loadWallets();
  }, [wallets]);

  useEffect(() => {
    if (context?.value.connectRejected) {
      context?.setValue((prev) => ({
        ...prev,
        user: { wallet: null },
        isConnecting: false,
        connectRejected: false,
      }));
    }
  }, [context?.value.connectRejected]);

  const handleConnect = (wallet: WalletActions) => {
    context?.setValue((prev) => ({
      ...prev,
      user: { wallet: { name: wallet.name, address: null } },
      isConnecting: true,
    }));
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-center w-full my-6">
        {context?.value.config.appLogo ? (
          <img src={context?.value.config.appLogo} alt={context?.value.config.appName} />
        ) : (
          <BluxLogo />
        )}
      </div>
      <div className="space-y-2">
        {visibleWallets.map((wallet) => (
          <CardItem
            key={wallet.name}
            {...wallet}
            label={wallet.name}
            startIcon={handleIcons(wallet.name)}
            onClick={() => handleConnect(wallet)}
          />
        ))}

        {hiddenWallets.length > 0 && !showAllWallets && (
          <CardItem
            endArrow
            label="All Stellar wallets"
            startIcon={<StellarIcon />}
            onClick={() => setShowAllWallets(true)}
          />
        )}
      </div>
      <div
        className="text-center font-medium text-sm mt-3 leading-[32px] cursor-pointer"
        style={{ color: context?.value.appearance?.accent }}
      >
        Login with passkey
      </div>

      <div className="font-semibold tracking-[-2%] text-[12px] text-center w-full pt-[6px]">
        Powered by{' '}
        <a
          href="https://blux.cc"
          target="_blank"
          rel="noreferrer"
          style={{ color: context?.value.appearance?.accent }}
        >
          Blux.cc
        </a>
      </div>
    </div>
  );
};

export default OnBoarding;
