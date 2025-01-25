import React, { useContext, useEffect, useState } from 'react';

import { ProviderContext } from '../../context/provider';
import { walletsConfig } from '../../wallets/walletsConfig';
import { WalletButton } from '../../components/WalletButton';
import { initializeRabetMobile } from '../../utils/initializeRabetMobile';

import BluxLogo from '../../assets/bluxLogo';
import { StellarIcon } from '../../assets/walletsLogo';

import { WalletActions } from '../../types';

type ChooseWalletProps = {
  closeModal: () => void;
};

const ChooseWallet = ({ closeModal }: ChooseWalletProps) => {
  const context = useContext(ProviderContext);

  const [availableWallets, setAvailableWallets] = useState<WalletActions[]>([]);
  const [showAllWallets, setShowAllWallets] = useState(false);
  const [hiddenWallets, setHiddenWallets] = useState<WalletActions[]>([]);

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
    const initializeWalletDetection = async () => {
      await detectWallet();
    };

    initializeWalletDetection();
    window.addEventListener('load', detectWallet, false);

    return () => {
      context?.setValue((prev) => ({
        ...prev,
        ready: true,
      }));
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
        isAuthenticated: true,
        modal: {
          isOpen: false,
        },
      }));
      closeModal();
    } catch (e) {
      context?.setValue((prev) => ({
        ...prev,
        modal: {
          isOpen: false,
        },
      }));
      closeModal();
      console.error('Error connecting to wallet:', e);
    }
    initializeRabetMobile();
  };

  const visibleWallets = showAllWallets ? hiddenWallets : availableWallets.slice(0, 2);

  return (
    <div className="w-full">
      <div className="flex justify-center items-center w-full py-4">
        <BluxLogo />
      </div>
      {visibleWallets.map((wallet) => {
        return <WalletButton {...wallet} key={wallet.name} onClick={() => handleConnect(wallet)} />;
      })}
      {hiddenWallets.length > 0 && !showAllWallets && (
        <WalletButton
          hasArrow
          name="All Stellar wallets"
          customIcon={<StellarIcon />}
          onClick={() => setShowAllWallets(true)}
        />
      )}
      <div className="text-center font-medium text-sm text-[#0D1292CC] mt-3 mb-[6px]">
        I don&apos;t have a wallet
      </div>
    </div>
  );
};

export default ChooseWallet;
