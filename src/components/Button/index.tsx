import React, { useContext } from 'react';

import clsx from 'clsx';
import { defaultAppearance } from '../../constants';
import { ProviderContext } from '../../context/provider';
import { getBorderRadius } from '../../utils/getBorderRadius';

export type ButtonProps = {
  name?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const Button = ({ onClick, className, disabled, children }: ButtonProps) => {
  const context = useContext(ProviderContext);

  const modalStyle = context?.value.appearance || defaultAppearance;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        borderRadius: getBorderRadius(modalStyle.cornerRadius),
      }}
      className={clsx(
        `w-full relative flex items-center h-14 border border-[#CDCEEE] my-2 pl-2 pr-4`,
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
