import React from 'react';

import getBorderRadius from '../../utils/getBorderRadius';
import { useProvider } from '../../context/provider';

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

const buttonBase =
  'flex justify-center items-center px-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 w-full';

const sizeClasses: Record<ButtonSize, string> = {
  small: 'h-8 text-sm gap-1',
  medium: 'h-12 text-sm gap-2',
  large: 'h-14 text-base gap-2',
};

const variantClasses: Record<ButtonVariant, string> = {
  outline:
    'border border-primary-500 text-primary-600 hover:!bg-primary-50 disabled:border-gray-300 disabled:text-gray-400 !bg-white',
  text: '!text-gray-700 hover:!bg-gray-50 disabled:text-gray-400 !bg-white',
  fill: '!bg-primary-500 text-white hover:!bg-primary-700 disabled:!bg-gray-400',
};

const stateClasses: Record<ButtonState, string> = {
  enabled: '!border-primary-100',
  disabled: 'pointer-events-none',
  selected: 'ring-2 ring-primary-600',
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
  const borderRadius = getBorderRadius(context.value.config.appearance.cornerRadius);

  return (
    <button
      onClick={onClick}
      className={`${buttonBase} ${sizeClasses[size]} ${variantClasses[variant]} ${stateClasses[state]} ${className}`}
      disabled={state === 'disabled'}
      style={{
        borderRadius,
        ...style,
      }}
    >
      {startIcon && <span>{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span>{endIcon}</span>}
    </button>
  );
};

export default Button;
