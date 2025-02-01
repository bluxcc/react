import { IAppearance, ModalHeights, ModalView } from '../types';

export const MODAL_HEIGHTS: ModalHeights = {
  [ModalView.PROFILE]: 364,
  [ModalView.CONNECTING]: 364,
  [ModalView.CHOOSE_WALLET]: 398,
};

export const MODAL_CONFIG = {
  defaultHeader: 'Connect Wallet',
} as const;

export const defaultAppearance: IAppearance = {
  theme: 'light',
  background: '#FFFFFF',
  accent: '#0D1292CC',
  textColor: '#000000',
  font: 'Inter',
  cornerRadius: 'none',
  cover: '',
};
