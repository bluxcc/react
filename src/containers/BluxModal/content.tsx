import React from 'react';

import Send from '../Pages/Send';
import { Routes } from '../../types';
import Profile from '../Pages/Profile';
import Waiting from '../Pages/Waiting';
import Activity from '../Pages/Activity';
import Successful from '../Pages/Successful';
import OnBoarding from '../Pages/OnBoarding';
import ConfirmCode from '../Pages/ConfirmCode';
import WrongNetwork from '../Pages/WrongNetwork';
import SignTransaction from '../Pages/SignTransaction';

interface ModalContentProps {
  showAllWallets: boolean;
  setShowAllWallets: (show: boolean) => void;
}

type RouteContent = {
  title: string;
  isSticky?: boolean;
  Component: React.FC<ModalContentProps>;
}

export const modalContent: Record<Routes, RouteContent> = {
  [Routes.ONBOARDING]: {
    title: 'Log in or Signup',
    Component: OnBoarding,
  },
  [Routes.PROFILE]: {
    title: 'Profile',
    Component: () => <Profile />,
  },
  [Routes.WAITING]: {
    title: '',
    Component: () => <Waiting />,
  },
  [Routes.SUCCESSFUL]: {
    title: '',
    Component: () => <Successful />,
  },
  [Routes.SIGN_TRANSACTION]: {
    title: 'Confirmation',
    Component: () => <SignTransaction />,
  },
  [Routes.SEND]: {
    title: 'Send',
    Component: () => <Send />,
  },
  [Routes.ACTIVITY]: {
    title: 'Activity',
    Component: () => <Activity />,
  },
  [Routes.OTP]: {
    title: '',
    Component: () => <ConfirmCode />,
  },
  [Routes.WRONG_NETWORK]: {
    isSticky: true,
    title: 'Wrong Network',
    Component: () => <WrongNetwork />,
  },
};
