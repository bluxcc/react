import React from 'react';
import { ArrowRight } from '../../assets/Icons';
import clsx from 'clsx';

type ButtonProps = {
  name?: string;
  onClick?: () => void;
  customIcon?: React.JSX.Element | React.ReactNode;
  children?: React.ReactNode;
  hasArrow?: boolean;
  className?: string;
  disabled?: boolean;
};

const Button = ({
  name,
  onClick,
  customIcon,
  hasArrow = false,
  className,
  disabled,
  children,
}: ButtonProps) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={clsx(
      `w-full relative flex items-center h-14 border border-[#CDCEEE] rounded-full my-2 pl-2 pr-4`,
      className,
    )}
  >
    {customIcon && (
      <div className="flex items-center justify-between font-medium">
        <div className="flex justify-center items-center border border-[#CDCEEE] rounded-full h-10 w-10 mr-4">
          {customIcon}
        </div>
        {name}
      </div>
    )}
    {children}
    {hasArrow && (
      <div className="absolute right-4">
        <ArrowRight />
      </div>
    )}
  </button>
);

export default Button;
