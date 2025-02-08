import { CornerRadius } from '../types';

const radiusMap: Record<CornerRadius, string> = {
  none: '0px',
  full: '32px',
  sm: '4px',
  md: '8px',
  lg: '12px',
};

export const getBorderRadius = (cornerRadius: CornerRadius): string => {
  return radiusMap[cornerRadius] || '0px';
};
