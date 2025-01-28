import { useContext, useEffect, useState } from 'react';
import { ProviderContext } from '../context/provider';
import { ModalState, ModalView } from '../types';
import { MODAL_CONFIG, MODAL_HEIGHTS } from '../constants';

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
  const context = useContext(ProviderContext);
  const [modalState, setModalState] = useState<ModalState>({
    view: ModalView.CHOOSE_WALLET,
    showAllWallets: false,
  });

  const getInitialHeight = (): number => {
    switch (modalState.view) {
      case ModalView.PROFILE:
        return MODAL_HEIGHTS[ModalView.PROFILE];
      case ModalView.CONNECTING:
        return MODAL_HEIGHTS[ModalView.CONNECTING];
      default:
        return MODAL_HEIGHTS[ModalView.CHOOSE_WALLET];
    }
  };

  const initialHeight = getInitialHeight();

  useEffect(() => {
    if (context?.value.isAuthenticated) {
      setModalState((prev) => ({ ...prev, view: ModalView.PROFILE }));
    }
    if (context?.value.isConnecting) {
      setModalState((prev) => ({ ...prev, view: ModalView.CONNECTING }));
    }
  }, [context?.value.isAuthenticated, context?.value.isConnecting]);

  const handleGoBack = () => {
    if (modalState.view === ModalView.CONNECTING) {
      setModalState((prev) => ({ ...prev, view: ModalView.CHOOSE_WALLET }));
    } else if (modalState.showAllWallets) {
      setModalState((prev) => ({ ...prev, showAllWallets: false }));
    }
  };

  const setShowAllWallets = (show: boolean) => {
    setModalState((prev) => ({ ...prev, showAllWallets: show }));
  };

  const showBackButton = modalState.view === ModalView.CONNECTING || modalState.showAllWallets;
  const showCloseButton =
    modalState.view === ModalView.CONNECTING || modalState.view === ModalView.PROFILE;
  const modalHeader = modalState.view === ModalView.CHOOSE_WALLET ? MODAL_CONFIG.defaultHeader : '';

  const closeModal = () => {
    context?.setValue((prev) => ({
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
