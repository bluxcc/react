import { useEffect, useState } from 'react';

import { MODAL_HEIGHTS } from '../constants';
import { ModalState, ModalView } from '../types';
import { useBluxProvider } from './useBluxProvider';

export interface UseConnectModalReturn {
  modalState: ModalState;
  handleGoBack: () => void;
  setShowAllWallets: (show: boolean) => void;
  closeModal: () => void;
  modalHeader: string;
  showBackButton: boolean;
  showCloseButton: boolean;
  initialHeight: number;
}

export const useConnectModal = (): UseConnectModalReturn => {
  const context = useBluxProvider();
  const [modalState, setModalState] = useState<ModalState>({
    view: ModalView.ONBOARDING,
    showAllWallets: false,
  });

  const getInitialHeight = (): number => {
    switch (modalState.view) {
      case ModalView.PROFILE:
        return MODAL_HEIGHTS[ModalView.PROFILE];
      case ModalView.CONNECTING:
        return MODAL_HEIGHTS[ModalView.CONNECTING];
      case ModalView.CONNECT_SUCCESS:
        return MODAL_HEIGHTS[ModalView.CONNECT_SUCCESS];
      case ModalView.SIGN_TRANSACTION:
        return MODAL_HEIGHTS[ModalView.SIGN_TRANSACTION];
      default:
        return MODAL_HEIGHTS[ModalView.ONBOARDING];
    }
  };

  const initialHeight = getInitialHeight();

  useEffect(() => {
    if (context.value.isAuthenticated && !context.value.signTx.openModal) {
      setModalState((prev) => ({ ...prev, view: ModalView.PROFILE }));
    } else if (context.value.isConnecting) {
      setModalState((prev) => ({ ...prev, view: ModalView.CONNECTING }));
    } else if (context.value.signTx.openModal) {
      setModalState((prev) => ({ ...prev, view: ModalView.SIGN_TRANSACTION }));
    } else if (context.value.connectSuccess) {
      setModalState((prev) => ({ ...prev, view: ModalView.CONNECT_SUCCESS }));
    } else {
      setModalState((prev) => ({ ...prev, view: ModalView.ONBOARDING, showAllWallets: false }));
    }
  }, [
    context.value.isAuthenticated,
    context.value.isConnecting,
    context.value.signTx.openModal,
    context.value.connectSuccess,
  ]);

  const handleGoBack = () => {
    if (modalState.view === ModalView.CONNECTING) {
      setModalState((prev) => ({ ...prev, view: ModalView.ONBOARDING }));
    } else if (modalState.showAllWallets) {
      setModalState((prev) => ({ ...prev, showAllWallets: false }));
    }
  };

  const setShowAllWallets = (show: boolean) => {
    setModalState((prev) => ({ ...prev, showAllWallets: show }));
  };
  const showBackButton =
    modalState.view === ModalView.CONNECTING ||
    (modalState.showAllWallets && modalState.view !== ModalView.PROFILE);

  const showCloseButton =
    modalState.view === ModalView.CONNECTING ||
    modalState.view === ModalView.PROFILE ||
    modalState.view === ModalView.CONNECT_SUCCESS ||
    modalState.view === ModalView.SIGN_TRANSACTION;

  const modalHeader =
    modalState.view === ModalView.ONBOARDING
      ? 'Log in or Signup'
      : modalState.view === 'PROFILE'
      ? 'Profile'
      : modalState.view === 'SIGN_TRANSACTION'
      ? 'Confirmation'
      : '';

  const closeModal = () => {
    context.setValue((prev) => ({
      ...prev,
      openModal: false,
    }));
  };

  return {
    modalState,
    handleGoBack,
    setShowAllWallets,
    modalHeader,
    showBackButton,
    showCloseButton,
    initialHeight,
    closeModal,
  };
};
