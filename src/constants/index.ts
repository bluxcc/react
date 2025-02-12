import { ModalHeights, ModalView } from '../types';

export const MODAL_HEIGHTS: ModalHeights = {
  [ModalView.PROFILE]: 324,
  [ModalView.CONNECTING]: 364,
  [ModalView.ONBOARDING]: 398,
};

export const MODAL_CONFIG = {
  defaultHeader: 'Connect Wallet',
} as const;
