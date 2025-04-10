import { CornerRadius } from '../types';

const radiusMap: Record<string, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  full: '32px',
};

const getBorderRadius = (cornerRadius: CornerRadius | string): string => {
  if (typeof cornerRadius === 'string' && cornerRadius.endsWith('px')) {
    return `${cornerRadius}`;
  }

  return radiusMap[cornerRadius] || '0px';
};

export default getBorderRadius;
