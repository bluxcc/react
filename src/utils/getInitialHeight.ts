import { MODAL_HEIGHTS } from '../constants';
import { ModalRoute, Routes } from '../types';

export const getInitialHeight = (route: ModalRoute): number => {
  switch (route.route) {
    case Routes.PROFILE:
      return MODAL_HEIGHTS[Routes.PROFILE];
    case Routes.CONNECTING:
      return MODAL_HEIGHTS[Routes.CONNECTING];
    case Routes.CONNECT_SUCCESS:
      return MODAL_HEIGHTS[Routes.CONNECT_SUCCESS];
    case Routes.SIGN_TRANSACTION:
      return MODAL_HEIGHTS[Routes.SIGN_TRANSACTION];
    default:
      return MODAL_HEIGHTS[Routes.ONBOARDING];
  }
};
