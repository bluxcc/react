import { CornerRadius } from '../types';

const radiusMap: Record<CornerRadius, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  full: '32px',
};

export const getBorderRadius = (cornerRadius: CornerRadius): string => {
  return radiusMap[cornerRadius] || '0px';
};
