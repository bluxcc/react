import React, { useContext } from 'react';
import clsx from 'clsx';

import { getBorderRadius } from '../../utils/getBorderRadius';
import { ProviderContext, defaultAppearance } from '../../context/provider';

export type ButtonProps = {
  name?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
};

const Button = ({ onClick, className, disabled, children, style }: ButtonProps) => {
  const context = useContext(ProviderContext);
  const modalStyle = context?.value.appearance || defaultAppearance;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        borderRadius: getBorderRadius(modalStyle.cornerRadius),
        ...style,
      }}
      className={clsx(
        `w-full relative flex items-center h-14 border border-primary-100 transition-colors duration-200 my-2 pl-2 pr-4`,
        className,
      )}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = modalStyle.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#cdceee';
      }}
    >
      {children}
    </button>
  );
};

export default Button;
