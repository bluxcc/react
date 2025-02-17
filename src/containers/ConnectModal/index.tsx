import React from 'react';
import Modal from '../../components/Modal';
import Profile from '../Pages/Profile';
import Connecting from '../Pages/Connecting';
import OnBoarding from '../Pages/OnBoarding';
import ConnectSuccess from '../Pages/ConnectSuccess';
import SignTransaction from '../Pages/SignTransaction';
import { Routes } from '../../types';
import { useModal } from '../../context/modalProvider';
import { getInitialHeight } from '../../utils/getInitialHeight';

export default function ConnectModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const { route, goBack, setShowAllWallets } = useModal();

  const modalHeaderMap: Record<Routes, string> = {
    [Routes.ONBOARDING]: 'Log in or Signup',
    [Routes.PROFILE]: 'Profile',
    [Routes.CONNECTING]: '',
    [Routes.CONNECT_SUCCESS]: '',
    [Routes.SIGN_TRANSACTION]: 'Confirmation',
  };

  const modalContentMap: Record<Routes, React.ReactNode> = {
    [Routes.CONNECTING]: <Connecting />,
    [Routes.CONNECT_SUCCESS]: <ConnectSuccess />,
    [Routes.PROFILE]: <Profile />,
    [Routes.SIGN_TRANSACTION]: <SignTransaction />,
    [Routes.ONBOARDING]: (
      <OnBoarding showAllWallets={route.showAllWallets} setShowAllWallets={setShowAllWallets} />
    ),
  };
  const showBackButton =
    route.route === Routes.CONNECTING || (route.showAllWallets && route.route !== Routes.PROFILE);

  return (
    <Modal
      isOpen={isOpen}
      onBack={goBack}
      onClose={closeModal}
      modalHeader={modalHeaderMap[route.route]}
      initialHeight={getInitialHeight(route)}
      icon={showBackButton ? 'back' : route.route === Routes.ONBOARDING ? 'info' : undefined}
    >
      {modalContentMap[route.route]}
    </Modal>
  );
}
