import { MODAL_HEIGHTS } from '../constants';
import { Routes } from '../types';

export const getInitialHeight = (route: Routes): number => {
  switch (route) {
    case Routes.PROFILE:
      return MODAL_HEIGHTS[Routes.PROFILE];
    case Routes.WAITING:
      return MODAL_HEIGHTS[Routes.WAITING];
    case Routes.SUCCESSFUL:
      return MODAL_HEIGHTS[Routes.SUCCESSFUL];
    case Routes.SIGN_TRANSACTION:
      return MODAL_HEIGHTS[Routes.SIGN_TRANSACTION];
    case Routes.SEND:
      return MODAL_HEIGHTS[Routes.SEND];
    case Routes.ACTIVITY:
      return MODAL_HEIGHTS[Routes.ACTIVITY];
    default:
      return MODAL_HEIGHTS[Routes.ONBOARDING];
  }
};
