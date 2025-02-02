import { CornerRadius } from '../types';

const radiusMap: Record<CornerRadius, string> = {
  none: '0px',
  full: '44px',
  sm: '3.42px',
  md: '8px',
  lg: '12px',
};

export const getBorderRadius = (cornerRadius: CornerRadius): string => {
  return radiusMap[cornerRadius] || '0px';
};
