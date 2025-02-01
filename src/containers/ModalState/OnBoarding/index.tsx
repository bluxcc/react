import React, { useContext, useEffect, useState } from 'react';

import { ProviderContext } from '../../../context/provider';
import { walletsConfig } from '../../../wallets/walletsConfig';

import BluxLogo from '../../../assets/bluxLogo';
import { StellarIcon } from '../../../assets/logos';

import { WalletActions } from '../../../types';
import { handleIcons } from '../../../utils/handleIcons';
import { ButtonWithIcon, ButtonWithIconAndArrow } from '../../../components/Button/buttonVariants';
import { defaultAppearance } from '../../../constants';

type OnBoardingProps = {
  showAllWallets: boolean;
  setShowAllWallets: (value: boolean) => void;
};

const OnBoarding = ({ showAllWallets, setShowAllWallets }: OnBoardingProps) => {
  const context = useContext(ProviderContext);

  const [availableWallets, setAvailableWallets] = useState<WalletActions[]>([]);
  const [hiddenWallets, setHiddenWallets] = useState<WalletActions[]>([]);

  const modalStyle = context?.value.appearance || defaultAppearance;

  const detectWallet = async () => {
    try {
      const walletChecks = await Promise.all(
        Object.values(walletsConfig).map(async (wallet) => {
          try {
            const isAvailable = await wallet.isAvailable();
            return { wallet, isAvailable };
          } catch (error) {
            console.error(`Error checking availability for ${wallet.name}:`, error);
            return { wallet, isAvailable: false };
          }
        }),
      );

      const available = walletChecks
        .filter(({ isAvailable }) => isAvailable)
        .map(({ wallet }) => wallet);

      setAvailableWallets(available);

      if (available.length > 2) {
        setHiddenWallets(available.slice(2));
      }
    } catch (error) {
      console.error('Error detecting wallet availability:', error);
    }
  };

  useEffect(() => {
    detectWallet();
    window.addEventListener('load', detectWallet, false);

    return () => {
      window.removeEventListener('load', detectWallet, false);
    };
  }, []);

  const handleConnect = async (wallet: WalletActions) => {
    context?.setValue((prev) => ({
      ...prev,
      user: {
        wallet: {
          name: wallet.name,
          address: null,
        },
      },
      isConnecting: true,
    }));
  };

  const visibleWallets = showAllWallets ? hiddenWallets : availableWallets.slice(0, 2);

  return (
    <div className="w-full">
      <div className="flex justify-center items-center w-full py-4">
        {modalStyle.cover ? (
          <img src={modalStyle.cover} alt={context?.value.config.appName} />
        ) : (
          <BluxLogo />
        )}
      </div>
      {visibleWallets.map((wallet) => {
        return (
          <ButtonWithIcon
            {...wallet}
            icon={handleIcons(wallet.name)}
            key={wallet.name}
            onClick={() => handleConnect(wallet)}
          />
        );
      })}
      {hiddenWallets.length > 0 && !showAllWallets && (
        <ButtonWithIconAndArrow
          name="All Stellar wallets"
          icon={<StellarIcon />}
          onClick={() => setShowAllWallets(true)}
        />
      )}

      <div
        className="text-center font-medium text-sm mt-3"
        style={{
          color: modalStyle.accent,
        }}
      >
        I don&apos;t have a wallet
      </div>
      <div className="font-semibold text-[10px] text-center w-full py-2">
        Powered by{' '}
        <a
          href="https://blux.cc"
          target="blank"
          style={{
            color: modalStyle.accent,
          }}
        >
          Blux.cc
        </a>
      </div>
    </div>
  );
};

export default OnBoarding;
