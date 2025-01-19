import React, { useContext, useEffect, useState } from 'react';

import Modal from '../../components/Modal';
import { WalletButton } from './walletButton';
import { handleIcons } from '../../utils/handleIcons';
import { ProviderContext } from '../../context/provider';
import { SupportedWallets, WalletActions } from '../../types';
import { walletsConfig } from '../../wallets/walletsConfig';
import { initializeRabetMobile } from '../../utils/initializeRabetMobile';
import { InfoIcon } from '../../assets/infoIcon';

type ChooseWalletProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export default function ChooseWallet({ isOpen, closeModal }: ChooseWalletProps) {
  const context = useContext(ProviderContext);

  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<SupportedWallets | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletActions[]>([]);

  useEffect(() => {
    const detectWallet = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          Object.values(walletsConfig).map(async (wallet) => ({
            ...wallet,
            available: await wallet.isAvailable().catch(() => false),
          })),
        );
        setAvailableWallets(results);
      } catch (error) {
        console.error('Error detecting wallet availability:', error);
      } finally {
        setLoading(false);
      }
    };
    if (context?.value.user.address === null) {
      setIsConnected(false);
    }

    detectWallet();
  }, []);

  const handleConnect = async (wallet: WalletActions) => {
    setSelectedWallet(wallet.name);
    try {
      const { publicKey } = await wallet.connect();
      context?.setValue((prev) => ({
        ...prev,
        user: {
          address: publicKey,
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

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} className="!w-[360px]">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="loader mb-4"></div>
          <p className="text-lg font-medium">Loading wallets...</p>
        </div>
      ) : isConnected ? (
        <div className="flex flex-col items-center justify-center h-40">
          <p className="text-lg font-medium">Connected to wallet</p>
          <p className="text-sm text-gray-600">{context?.value.user.address}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {!selectedWallet ? (
            <div className="w-full">
              <div className="w-full flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <InfoIcon />
                </div>
                <p className="text-lg font-semibold text-center flex-1">Connect Wallet</p>
                <div className="w-4"></div>
              </div>
              {availableWallets.map((wallet) => (
                <WalletButton
                  {...wallet}
                  available={!!wallet.isAvailable()}
                  key={wallet.name}
                  onClick={() => handleConnect(wallet)}
                />
              ))}
              <div className="text-center font-medium text-sm text-[#0D1292CC] mt-3">
                I don&apos;t have a wallet
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <div className="h-12 w-12 flex justify-center items-center mb-4">
                {handleIcons(selectedWallet)}
              </div>
              <p className="text-lg font-medium mb-4">Connecting to {selectedWallet}...</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
