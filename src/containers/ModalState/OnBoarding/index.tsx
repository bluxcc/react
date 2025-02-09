import React, { useContext, useEffect, useState, useMemo } from 'react';

import { ProviderContext } from '../../../context/provider';
import { ButtonWithIcon, ButtonWithIconAndArrow } from '../../../components/Button/buttonVariants';

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
  const [wallets, setWallets] = useState<WalletActions[]>([]);

  useEffect(() => {
    const loadWallets = async () => {
      const mappedWallets = await getMappedWallets();
      const available = mappedWallets
        .filter(({ isAvailable }) => isAvailable)
        .map(({ wallet }) => wallet);

      setWallets(available);
      context?.setValue((prev) => ({ ...prev, isReady: true }));
    };

    loadWallets();
    window.addEventListener('load', loadWallets);

    return () => window.removeEventListener('load', loadWallets);
  }, []);

  const hiddenWallets = useMemo(() => (wallets.length > 3 ? wallets.slice(2) : []), [wallets]);

  const visibleWallets = useMemo(
    () => (wallets.length > 3 ? (showAllWallets ? hiddenWallets : wallets.slice(0, 2)) : wallets),
    [wallets, showAllWallets, hiddenWallets],
  );

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
      <div className="flex justify-center items-center w-full py-4">
        {context?.value.config.appLogo ? (
          <img src={context?.value.config.appLogo} alt={context?.value.config.appName} />
        ) : (
          <BluxLogo />
        )}
      </div>

      {visibleWallets.map((wallet) => (
        <ButtonWithIcon
          key={wallet.name}
          {...wallet}
          icon={handleIcons(wallet.name)}
          onClick={() => handleConnect(wallet)}
        />
      ))}

      {hiddenWallets.length > 0 && !showAllWallets && (
        <ButtonWithIconAndArrow
          name="All Stellar wallets"
          icon={<StellarIcon />}
          onClick={() => setShowAllWallets(true)}
        />
      )}

      <div
        className="text-center font-medium text-sm mt-3 cursor-pointer"
        style={{ color: context?.value.appearance?.accent }}
      >
        I don&apos;t have a wallet
      </div>

      <div className="font-semibold text-[10px] text-center w-full py-2">
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
