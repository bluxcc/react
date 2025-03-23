import { IAppearance } from '../types';

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
