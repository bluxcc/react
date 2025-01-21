import React, { useContext, useEffect, useState } from 'react';

import Modal from '../../components/Modal';
import { WalletButton } from '../../components/WalletButton';
import { ProviderContext } from '../../context/provider';
import { SupportedWallets, WalletActions } from '../../types';
import { walletsConfig } from '../../wallets/walletsConfig';
import { initializeRabetMobile } from '../../utils/initializeRabetMobile';

import BluxLogo from '../../assets/bluxLogo';
import Connected from '../connected';
import Connecting from '../connecting';
import { StellarIcon } from '../../assets/walletsLogo';

type ChooseWalletProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export default function ChooseWallet({ isOpen, closeModal }: ChooseWalletProps) {
  const context = useContext(ProviderContext);

  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<SupportedWallets | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletActions[]>([]);
  const [showAllWallets, setShowAllWallets] = useState(false);

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
    setSelectedWallet(wallet.name);
    try {
      const { publicKey } = await wallet.connect();
      context?.setValue((prev) => ({
        ...prev,
        user: {
          wallet: {
            name: selectedWallet,
            address: publicKey,
          },
        },
        modal: {
          isOpen: false,
        },
      }));
      handleCloseModal();
      if (publicKey) {
        setIsConnected(true);
      }
    } catch (e) {
      context?.setValue((prev) => ({
        ...prev,
        modal: {
          isOpen: false,
        },
      }));
      handleCloseModal();
      console.error('Error connecting to wallet:', e);
    }
    initializeRabetMobile();
  };

  const handleCloseModal = () => {
    setSelectedWallet(null);
    closeModal();
  };

  const visibleWallets = showAllWallets ? availableWallets : availableWallets.slice(0, 2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="!w-[360px]"
      modalStatus={isConnected ? 'connected' : 'notConnected'}
      showInfoIcon={isConnected ? false : true}
    >
      {isConnected ? (
        <Connected closeModal={handleCloseModal} />
      ) : (
        <div className="flex flex-col items-center">
          {!selectedWallet ? (
            <div className="w-full">
              <div className="flex justify-center items-center w-full py-4">
                <BluxLogo />
              </div>
              {visibleWallets.map((wallet) => {
                return (
                  <WalletButton
                    {...wallet}
                    key={wallet.name}
                    onClick={() => handleConnect(wallet)}
                  />
                );
              })}
              {availableWallets.length > 2 && !showAllWallets && (
                <WalletButton
                  name="All Stellar wallets"
                  hasArrow
                  customIcon={<StellarIcon />}
                  onClick={() => setShowAllWallets(true)}
                />
              )}
              <div className="text-center font-medium text-sm text-[#0D1292CC] mt-3 mb-[6px]">
                I don&apos;t have a wallet
              </div>
            </div>
          ) : (
            <Connecting />
          )}
        </div>
      )}
    </Modal>
  );
}
