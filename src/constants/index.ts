import { ModalHeights, Routes } from '../types';
import { IAppearance } from '../types';

export const MODAL_HEIGHTS: ModalHeights = {
  [Routes.PROFILE]: 469,
  [Routes.WAITING]: 340,
  [Routes.SIGN_TRANSACTION]: 458.4,
  [Routes.SUCCESSFUL]: 328,
  [Routes.ONBOARDING]: 399,
  [Routes.SEND]: 356,
  [Routes.ACTIVITY]: 356,
};

export const HORIZON_SERVERS = {
  public: 'https://horizon.stellar.org',
  testnet: 'https://horizon-testnet.stellar.org',
  futurenet: 'https://horizon-futurenet.stellar.org',
};

export const defaultAppearance: IAppearance = {
  theme: 'light',
  background: '#ffffff',
  accent: '#0C1083',
  textColor: '#000000',
  font: 'Inter',
  cornerRadius: 'full',
  cover: '',
};
