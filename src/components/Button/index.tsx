import React from 'react';

import clsx from 'clsx';

export type ButtonProps = {
  name?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const Button = ({ onClick, className, disabled, children }: ButtonProps) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={clsx(
      `w-full relative flex items-center h-14 border border-[#CDCEEE] rounded-full my-2 pl-2 pr-4`,
      className,
    )}
  >
    {children}
  </button>
);

export default Button;
