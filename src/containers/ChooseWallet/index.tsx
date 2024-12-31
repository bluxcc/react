import React, { useState, useEffect } from 'react';
import { useWallet } from '../../wallets/useWallet';
import { SupportedWallets } from '../../types';
import { initializeRabetMobile } from '../../utils/initializeRabetMobile';
import Modal from '../../components/Modal';
import { handleIcons } from '../../utils/handleIcons';
import { Wallet, WalletButton } from './walletButton';
import useBlux from '../../wallets/useBlux';

type ChooseWalletProps = {
  isOpen: boolean;
  closeModal?: () => void;
};

export default function ChooseWallet({ isOpen, closeModal }: ChooseWalletProps) {
  // const { walletsList, errorMessage, connect, connectedWallet } = useWallet();
  const { connect, user } = useBlux();
  const [selectedWallet, setSelectedWallet] = useState<SupportedWallets | null>(null);
  const [recentWallets, setRecentWallets] = useState<SupportedWallets[]>([]);
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveAvailability = async () => {
      setLoading(true);
      try {
        const resolvedWallets = await Promise.all(
          walletsList.map(async (wallet) => {
            try {
              return {
                wallet: wallet.type as SupportedWallets,
                name: wallet.name,
                icon: wallet.icon,
                available: await wallet.isAvailable(),
              };
            } catch (error) {
              console.error(`Error checking availability for ${wallet.name}:`, error);
              return {
                wallet: wallet.type as SupportedWallets,
                name: wallet.name,
                icon: wallet.icon,
                available: false,
              };
            }
          }),
        );
        setAvailableWallets(resolvedWallets);
      } catch (error) {
        console.error('Error resolving wallet availability:', error);
      }
      setLoading(false);
    };
    resolveAvailability();
    return;
  }, [walletsList]);

  const handleConnect = async (wallet: SupportedWallets) => {
    if (wallet === selectedWallet && (await user.address)) {
      return;
    }

    setSelectedWallet(wallet);
    initializeRabetMobile();

    try {
      await connect();
      setRecentWallets((prev) => [wallet, ...prev.filter((w) => w !== wallet)]);
      closeModal();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={closeModal} className="!w-[360px]">
        <div className="flex flex-col items-center justify-center h-40">
          <div className="loader mb-4"></div>
          <p className="text-lg font-medium">Loading wallets...</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="!w-[360px]">
      <div className="flex flex-col items-center">
        {!selectedWallet ? (
          <>
            {recentWallets.length > 0 && (
              <div className="w-full">
                <h3 className="text-lg font-bold mb-2">Recent Wallets</h3>
                {recentWallets.map((wallet) => (
                  <WalletButton
                    key={wallet}
                    {...availableWallets.find((w) => w.wallet === wallet)!}
                    onClick={() => handleConnect(wallet)}
                  />
                ))}
              </div>
            )}

            <div className="w-full">
              <h3 className="text-lg font-bold text-start mb-2">All Wallets</h3>
              {availableWallets.map((wallet) => (
                <WalletButton
                  key={wallet.wallet}
                  {...wallet}
                  onClick={() => handleConnect(wallet.wallet)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="h-12 w-12 flex justify-center items-center mb-4">
              {handleIcons(
                availableWallets.find((w) => w.wallet === selectedWallet)?.name || selectedWallet,
              )}
            </div>
            <p className="text-lg font-medium mb-4">
              Connecting to {availableWallets.find(({ wallet }) => wallet === selectedWallet)?.name}
              ...
            </p>
          </div>
        )}
        {errorMessage && <div className="p-4 text-red-500">{errorMessage}</div>}
      </div>
    </Modal>
  );
}
