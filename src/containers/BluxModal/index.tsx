import React, { useState } from 'react';

import Modal from '../../components/Modal';
import { useProvider } from '../../context/provider';

import { Routes } from '../../types';
import { modalContent } from './content';

interface BluxModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function BluxModal({ isOpen, closeModal }: BluxModalProps) {
  const { route, setRoute, value } = useProvider();
  const [showAllWallets, setShowAllWallets] = useState(false);

  const shouldShowBackButton =
    (route === Routes.WAITING && value.waitingStatus !== 'signing') ||
    (route === Routes.ONBOARDING && showAllWallets) ||
    route === Routes.ACTIVITY ||
    route === Routes.SEND ||
    route === Routes.OTP;

  let modalIcon: 'back' | 'info' | undefined;

  if (shouldShowBackButton) {
    modalIcon = 'back';
  } else if (route === Routes.ONBOARDING) {
    modalIcon = 'info';
  }

  const handleBackNavigation = () => {
    if (
      route === Routes.WAITING ||
      (route === Routes.OTP && !value.isAuthenticated)
    ) {
      setRoute(Routes.ONBOARDING);
    } else if (showAllWallets) {
      setShowAllWallets(false);
    } else if (route === Routes.SEND || route === Routes.ACTIVITY) {
      setRoute(Routes.PROFILE);
    }
  };

  const handleCloseModal = () => {
    closeModal();

    const waitingStatus = value.waitingStatus;

    if (route === Routes.SUCCESSFUL && waitingStatus === 'signing') {
      const { resolver, result } = value.signTransaction;

      if (resolver && result) {
        resolver(result);
      }
    }
  };

  const { title, Component, isSticky } = modalContent[route];

  const showCloseModalIcon =
    route === Routes.WRONG_NETWORK ||
    route === Routes.WAITING ||
    route === Routes.SUCCESSFUL;

  return (
    <Modal
      isOpen={isOpen}
      onBack={handleBackNavigation}
      onClose={isSticky ? () => {} : handleCloseModal}
      title={title}
      isSticky={isSticky}
      icon={modalIcon}
      closeButton={!showCloseModalIcon}
    >
      <Component
        showAllWallets={showAllWallets}
        setShowAllWallets={setShowAllWallets}
      />
    </Modal>
  );
}
