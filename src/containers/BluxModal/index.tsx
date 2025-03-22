import React, { useState } from 'react';

import Modal from '../../components/Modal';
import { useProvider } from '../../context/provider';

import { Routes } from '../../types';
import { modalContent } from './content';
import { MODAL_HEIGHTS } from '../../constants';

interface BluxModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function BluxModal({ isOpen, closeModal }: BluxModalProps) {
  const { route, setRoute } = useProvider();
  const [showAllWallets, setShowAllWallets] = useState(false);

  const shouldShowBackButton =
    route === Routes.WAITING ||
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
    if (route === Routes.WAITING || route === Routes.OTP) {
      setRoute(Routes.ONBOARDING);
    } else if (showAllWallets) {
      setShowAllWallets(false);
    } else if (route === Routes.SEND || route === Routes.ACTIVITY) {
      setRoute(Routes.PROFILE);
    }
  };

  const { title, Component } = modalContent[route];

  return (
    <Modal
      isOpen={isOpen}
      onBack={handleBackNavigation}
      onClose={closeModal}
      title={title}
      initialHeight={MODAL_HEIGHTS[route]}
      icon={modalIcon}
      closeButton={route === Routes.ONBOARDING ? false : true}
    >
      <Component showAllWallets={showAllWallets} setShowAllWallets={setShowAllWallets} />
    </Modal>
  );
}
