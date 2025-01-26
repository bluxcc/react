import React, { useContext, useEffect, useState } from 'react';

import Modal from '../../components/Modal';

import Connected from '../ModalState/Connected';
import Connecting from '../ModalState/Connecting';
import ChooseWallet from '../ModalState/ChooseWallet';
import { ProviderContext } from '../../context/provider';

type ConnectModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export default function ConnectModal({ isOpen, closeModal }: ConnectModalProps) {
  const context = useContext(ProviderContext);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showAllWallets, setShowAllWallets] = useState(false); // State to manage hidden wallets view

  useEffect(() => {
    if (context?.value.isAuthenticated) {
      setIsConnected(true);
    }
    if (context?.value.isConnecting) {
      setIsConnecting(true);
    }
  }, [context?.value.isAuthenticated, context?.value.isConnecting]);

  const handleGoBack = () => {
    if (isConnecting) {
      setIsConnecting(false);
    } else if (showAllWallets) {
      setShowAllWallets(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="!w-[360px]"
      modalHeader={isConnecting ? '' : 'Connect Wallet'}
      icon={isConnecting || showAllWallets ? 'back' : 'info'}
      closeButton={isConnecting ? true : false}
      onBack={handleGoBack}
    >
      {isConnected ? (
        <Connected closeModal={closeModal} />
      ) : (
        <div className="flex flex-col items-center">
          {isConnecting ? (
            <Connecting />
          ) : (
            <ChooseWallet
              closeModal={closeModal}
              showAllWallets={showAllWallets}
              setShowAllWallets={setShowAllWallets}
            />
          )}
        </div>
      )}
    </Modal>
  );
}
