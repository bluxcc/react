import { IAppearance } from '../types';

export const HORIZON_SERVERS = {
  public: 'https://horizon.stellar.org',
  testnet: 'https://horizon-testnet.stellar.org',
  futurenet: 'https://horizon-futurenet.stellar.org',
};

export const defaultLightTheme: IAppearance = {
  theme: 'light',
  logo: '',
  font: 'Manrope',
  accent: '#0C1083',
  borderWidth: '1px',
  bgField: '#ffffff',
  cornerRadius: '32px',
  textColor: '#000000',
  background: '#ffffff',
  borderColor: '#cdceee',
};

export const defaultDarkTheme: IAppearance = {
  theme: 'dark',
  logo: '',
  font: 'Manrope',
  accent: '#FFFFFF',
  borderWidth: '1px',
  bgField: '#1A1A1A',
  cornerRadius: '32px',
  textColor: '#FFFFFF',
  background: '#000000',
  borderColor: '#333333',
};
