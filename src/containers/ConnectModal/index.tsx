import React from 'react';

import Modal from '../../components/Modal';
import Profile from '../ModalState/Profile';
import Connecting from '../ModalState/Connecting';
import OnBoarding from '../ModalState/OnBoarding';
import ConnectSuccess from '../ModalState/ConnectSuccess';

import { useConnectModal } from '../../hooks/useConnectModal';
import { useGoogleFonts } from '../../hooks/useGoogleFont';

import { ModalView } from '../../types';

interface ConnectModalProps {
  isOpen: boolean;
}

export default function ConnectModal({ isOpen }: ConnectModalProps) {
  const {
    modalState,
    handleGoBack,
    setShowAllWallets,
    modalHeader,
    showBackButton,
    showCloseButton,
    initialHeight,
    closeModal,
  } = useConnectModal();

  useGoogleFonts();

  const renderContent = () => {
    switch (modalState.view) {
      case ModalView.CONNECTING:
        return <Connecting />;
      case ModalView.CONNECT_SUCCESS:
        return <ConnectSuccess />;
      case ModalView.PROFILE:
        return <Profile />;
      default:
        return (
          <div className="flex flex-col items-center">
            <OnBoarding
              showAllWallets={modalState.showAllWallets}
              setShowAllWallets={setShowAllWallets}
            />
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      modalHeader={modalHeader}
      icon={showBackButton ? 'back' : 'info'}
      closeButton={showCloseButton}
      onBack={handleGoBack}
      initialHeight={initialHeight}
    >
      {renderContent()}
    </Modal>
  );
}
