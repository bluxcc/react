import React, { useContext, useEffect, useState } from 'react';

import Modal from '../../components/Modal';
import { WalletButton } from './walletButton';
import { handleIcons } from '../../utils/handleIcons';
import { ProviderContext } from '../../context/provider';
import { SupportedWallets, WalletActions } from '../../types';
import { useWalletConfigs } from '../../wallets/useWalletConfigs';
import { initializeRabetMobile } from '../../utils/initializeRabetMobile';

type ChooseWalletProps = {
  isOpen: boolean;
  closeModal?: () => void;
};

export default function ChooseWallet({ isOpen, closeModal }: ChooseWalletProps) {
  const context = useContext(ProviderContext);
  const walletConfigs = useWalletConfigs();

  const [selectedWallet, setSelectedWallet] = useState<SupportedWallets | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletActions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectWallet = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          Object.values(walletConfigs).map(async (wallet) => ({
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
    } catch (e) {
      context?.setValue((prev) => ({
        ...prev,
        modal: {
          isOpen: false,
        },
      }));
      console.error('Error connecting to wallet:', e);
    }

    initializeRabetMobile();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="!w-[360px]">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="loader mb-4"></div>
          <p className="text-lg font-medium">Loading wallets...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {!selectedWallet ? (
            <div className="w-full">
              <h3 className="text-lg font-bold text-start mb-2">All Wallets</h3>
              {availableWallets.map((wallet) => (
                <WalletButton
                  {...wallet}
                  available={!!wallet.isAvailable()}
                  key={wallet.name}
                  onClick={() => handleConnect(wallet)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <div className="h-12 w-12 flex justify-center items-center mb-4">
                {handleIcons(selectedWallet)}
              </div>
              <p className="text-lg font-medium mb-4">
                Connecting to {selectedWallet}
                ...
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
