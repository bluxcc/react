import React, { useContext, useEffect, useState } from 'react';

import Modal from '../../components/Modal';

import Connected from '../Connected';
import Connecting from '../Connecting';
import ChooseWallet from '../ChooseWallet';
import { ProviderContext } from '../../context/provider';

type ConnectModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export default function ConnectModal({ isOpen, closeModal }: ConnectModalProps) {
  const context = useContext(ProviderContext);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (context?.value.isAuthenticated) {
      setIsConnected(true);
    }
    if (context?.value.isConnecting) {
      setIsConnecting(true);
    }
  }, [context?.value.isAuthenticated, context?.value.isConnecting]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="!w-[360px]"
      modalHeader={!isConnecting ? 'Connect wallet' : ''}
      icon={isConnecting ? 'back' : 'info'}
      closeButton={isConnecting ? true : false}
    >
      {isConnected ? (
        <Connected closeModal={closeModal} />
      ) : (
        <div className="flex flex-col items-center">
          {isConnecting ? <Connecting /> : <ChooseWallet closeModal={closeModal} />}
        </div>
      )}
    </Modal>
  );
}
