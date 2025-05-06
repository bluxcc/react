import { IAppearance } from '../types';

export const ASSET_SERVER = 'https://asset.rabet.io/assets';

export const defaultLightTheme: IAppearance = {
  theme: 'light',
  logo: '',
  font: 'Manrope',
  accent: '#0c1083',
  borderWidth: '1px',
  bgField: '#ffffff',
  borderRadius: '32px',
  textColor: '#000000',
  background: '#ffffff',
  includeBorders: true,
  borderColor: '#cdceee',
};

export const defaultDarkTheme: IAppearance = {
  theme: 'dark',
  logo: '',
  font: 'Manrope',
  accent: '#ffffff',
  borderWidth: '1px',
  bgField: '#1a1a1a',
  borderRadius: '32px',
  textColor: '#ffffff',
  background: '#000000',
  includeBorders: true,
  borderColor: '#333333',
};
