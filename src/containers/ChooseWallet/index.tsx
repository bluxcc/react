import React, { useContext, useEffect, useState } from 'react';

import Modal from '../../components/Modal';
import { WalletButton } from './walletButton';
import { handleIcons } from '../../utils/handleIcons';
import { ProviderContext } from '../../context/provider';
import { SupportedWallets, WalletActions } from '../../types';
import { walletConfigs } from '../../wallets/walletConfigs';
import { initializeRabetMobile } from '../../utils/initializeRabetMobile';

type ChooseWalletProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export default function ChooseWallet({ isOpen, closeModal }: ChooseWalletProps) {
  const context = useContext(ProviderContext);

  const [loading, setLoading] = useState(true);
  // todo fix isConnected logic
  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<SupportedWallets | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletActions[]>([]);

  useEffect(() => {
    const detectWallet = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          Object.values(walletConfigs).map(async wallet => ({
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
      context?.setValue(prev => ({
        ...prev,
        user: {
          address: publicKey,
        },
        modal: {
          isOpen: false,
        },
      }));
      closeModal();
      setIsConnected(true);
      // temporary setting selected wallet null for test until we implement profile of user
      setSelectedWallet(null);
    } catch (e) {
      context?.setValue(prev => ({
        ...prev,
        modal: {
          isOpen: false,
        },
      }));
      closeModal();
      setIsConnected(false);
      console.error('Error connecting to wallet:', e);
    }

    initializeRabetMobile();
  };

  // isConnected is currently not showing

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="!w-[360px]">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="loader mb-4"></div>
          <p className="text-lg font-medium">Loading wallets...</p>
        </div>
      ) : isConnected ? (
        <div className="flex flex-col items-center justify-center h-40">
          <p className="text-lg font-medium">Connected to wallet</p>
          <p className="text-sm text-gray-600">{context?.value.user.address}</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={closeModal}>
            Close
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {!selectedWallet ? (
            <div className="w-full">
              <h3 className="text-lg font-bold text-start mb-2">All Wallets</h3>
              {availableWallets.map(wallet => (
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
              <p className="text-lg font-medium mb-4">Connecting to {selectedWallet}...</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
