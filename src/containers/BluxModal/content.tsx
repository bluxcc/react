import React from 'react';

import Swap from '../Pages/Swap';
import Send from '../Pages/Send';
import Receive from '../Pages/Receive';
import Profile from '../Pages/Profile';
import Waiting from '../Pages/Waiting';
import Activity from '../Pages/Activity';
import Successful from '../Pages/Successful';
import OnBoarding from '../Pages/OnBoarding';
import ConfirmCode from '../Pages/ConfirmCode';
import WrongNetwork from '../Pages/WrongNetwork';
import SignTransaction from '../Pages/SignTransaction';

import { Routes } from '../../types';
import { LanguageKey } from '../../constants/locales';
import { translate } from '../../utils/translate';
import Balances from '../Pages/Balances';

type RouteContent = {
  title: string;
  isSticky?: boolean;
  Component: React.JSX.Element;
};

export const getModalContent = (
  lang: LanguageKey,
): Record<Routes, RouteContent> => ({
  [Routes.ONBOARDING]: {
    title: translate('logInOrSignUp', lang),
    Component: <OnBoarding />,
  },
  [Routes.PROFILE]: {
    title: translate('profile', lang),
    Component: <Profile />,
  },
  [Routes.WAITING]: {
    title: '',
    Component: <Waiting />,
  },
  [Routes.SUCCESSFUL]: {
    title: '',
    Component: <Successful />,
  },
  [Routes.SIGN_TRANSACTION]: {
    title: translate('confirmation', lang),
    Component: <SignTransaction />,
  },
  [Routes.SEND]: {
    title: translate('send', lang),
    Component: <Send />,
  },
  [Routes.ACTIVITY]: {
    title: translate('activity', lang),
    Component: <Activity />,
  },
  [Routes.OTP]: {
    title: '',
    Component: <ConfirmCode />,
  },
  [Routes.RECEIVE]: {
    title: 'Receive address',
    Component: <Receive />,
  },
  [Routes.SWAP]: {
    title: 'Swap',
    Component: <Swap />,
  },
  [Routes.BALANCES]: {
    title: 'Balances',
    Component: <Balances />,
  },
  [Routes.WRONG_NETWORK]: {
    isSticky: true,
    title: translate('wrongNetwork', lang),
    Component: <WrongNetwork />,
  },
});
