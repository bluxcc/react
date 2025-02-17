import React from 'react';
import Profile from '../Pages/Profile';
import Connecting from '../Pages/Connecting';
import ConnectSuccess from '../Pages/ConnectSuccess';
import OnBoarding from '../Pages/OnBoarding';
import SignTransaction from '../Pages/SignTransaction';
import { Routes } from '../../types';

interface ModalContentProps {
  showAllWallets: boolean;
  setShowAllWallets: (show: boolean) => void;
}

export const modalContent: Record<
  Routes,
  { title: string; Component: React.FC<ModalContentProps> }
> = {
  [Routes.ONBOARDING]: {
    title: 'Log in or Signup',
    Component: OnBoarding,
  },
  [Routes.PROFILE]: {
    title: 'Profile',
    Component: () => <Profile />,
  },
  [Routes.CONNECTING]: {
    title: '',
    Component: () => <Connecting />,
  },
  [Routes.CONNECT_SUCCESS]: {
    title: '',
    Component: () => <ConnectSuccess />,
  },
  [Routes.SIGN_TRANSACTION]: {
    title: 'Confirmation',
    Component: () => <SignTransaction />,
  },
};
