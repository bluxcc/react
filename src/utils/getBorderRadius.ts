import { CornerRadius } from '../types';

const radiusMap: Record<CornerRadius, string> = {
  none: '0',
  full: 'full',
  sm: '1',
  md: '3',
  lg: '4',
};

export const getBorderRadius = (cornerRadius: CornerRadius): string => {
  return radiusMap[cornerRadius] || '4';
};
