import React from 'react';

import getBorderRadius from '../../utils/getBorderRadius';
import { useProvider } from '../../context/provider';
import getContrastColor from '../../utils/getContrastColor';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'outline' | 'text' | 'fill';
type ButtonState = 'enabled' | 'disabled' | 'selected';

interface ButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  state?: ButtonState;
  children: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const buttonBase = 'flex justify-center items-center px-[10px] transition-all w-full';

const sizeClasses: Record<ButtonSize, string> = {
  small: 'h-8 text-sm gap-1',
  medium: 'h-12 text-sm gap-2',
  large: 'h-14 text-base gap-2',
};

const Button = ({
  size = 'large',
  variant = 'outline',
  state = 'enabled',
  children,
  startIcon,
  endIcon,
  onClick,
  style,
  className,
}: ButtonProps) => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const borderRadius = getBorderRadius(appearance.cornerRadius);

  const baseStyle: React.CSSProperties = {
    borderRadius,
    cursor: state === 'disabled' ? 'not-allowed' : 'pointer',
    opacity: state === 'disabled' ? 0.5 : 1,
    pointerEvents: state === 'disabled' ? 'none' : undefined,
    ...style,
  };

  if (variant === 'outline') {
    Object.assign(baseStyle, {
      border: `1px solid ${appearance.accent}`,
      color: appearance.accent,
      backgroundColor: appearance.background,
    });
  } else if (variant === 'fill') {
    Object.assign(baseStyle, {
      backgroundColor: appearance.accent,
      fontWeight: '500',
      color: getContrastColor(appearance.accent),
    });
  } else if (variant === 'text') {
    Object.assign(baseStyle, {
      color: appearance.accent,
      backgroundColor: 'transparent',
    });
  }

  if (state === 'selected') {
    baseStyle.boxShadow = `0 0 0 2px ${appearance.accent}`;
  }

  return (
    <button
      onClick={onClick}
      disabled={state === 'disabled'}
      className={`${buttonBase} ${sizeClasses[size]} ${className ?? ''}`}
      style={baseStyle}
    >
      {startIcon && <span>{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span>{endIcon}</span>}
    </button>
  );
};

export default Button;
