import React from 'react';

import Modal from '../../components/Modal';
import Profile from '../Pages/Profile';
import Connecting from '../Pages/Connecting';
import OnBoarding from '../Pages/OnBoarding';
import ConnectSuccess from '../Pages/ConnectSuccess';

import { useConnectModal } from '../../hooks/useConnectModal';
import { useGoogleFonts } from '../../hooks/useGoogleFont';

import { ModalView } from '../../types';
import SignTransaction from '../Pages/SignTransaction';

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
      case ModalView.SIGN_TRANSACTION:
        return <SignTransaction />;
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
