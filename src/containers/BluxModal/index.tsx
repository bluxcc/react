import React from 'react';

import Modal from '../../components/Modal';
import Header from '../../components/Header';
import { useProvider } from '../../context/provider';

import { Routes } from '../../types';
import { getModalContent } from './content';
import { LanguageKey } from '../../constants/locales';

interface BluxModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function BluxModal({ isOpen, closeModal }: BluxModalProps) {
  const { route, setRoute, value, setValue } = useProvider();

  const shouldShowBackButton =
    (route === Routes.WAITING && value.waitingStatus !== 'signing') ||
    (route === Routes.ONBOARDING && value.showAllWallets) ||
    route === Routes.ACTIVITY ||
    route === Routes.SEND ||
    route === Routes.OTP ||
    route === Routes.BALANCES ||
    route === Routes.RECEIVE ||
    route === Routes.SWAP;

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
    } else if (value.showAllWallets) {
      setValue((prev) => ({ ...prev, showAllWallets: false }));
    } else if (
      route === Routes.SEND ||
      route === Routes.ACTIVITY ||
      route === Routes.BALANCES ||
      route === Routes.RECEIVE ||
      route === Routes.SWAP
    ) {
      setRoute(Routes.PROFILE);
    }
  };

  const handleCloseModal = () => {
    closeModal();

    const waitingStatus = value.waitingStatus;

    const { resolver, rejecter, result } = value.signTransaction;

    if (route === Routes.SUCCESSFUL && waitingStatus === 'signing') {
      if (resolver && result) {
        resolver(result);
      }
    } else if (route === Routes.SIGN_TRANSACTION) {
      if (rejecter) {
        rejecter({ code: 4001, message: 'User rejected the transaction' });
      }
    }
  };
  const showCloseModalIcon =
    route === Routes.WRONG_NETWORK ||
    route === Routes.WAITING ||
    route === Routes.SUCCESSFUL;

  const modalContent = getModalContent(value.config.lang as LanguageKey);

  const { title, Component, isSticky } = modalContent[route];

  return (
    <Modal
      isOpen={isOpen}
      isSticky={isSticky}
      onClose={isSticky ? () => {} : handleCloseModal}
    >
      <Header
        onBack={handleBackNavigation}
        onClose={isSticky ? () => {} : handleCloseModal}
        title={title}
        icon={modalIcon}
        closeButton={!showCloseModalIcon}
      />
      {Component}
    </Modal>
  );
}
