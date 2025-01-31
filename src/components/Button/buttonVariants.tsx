import React from 'react';

import Button, { ButtonProps } from './index';
import { ArrowRight } from '../../assets/Icons';

export const ButtonWithIcon = ({
  icon,
  name,
  ...props
}: ButtonProps & { icon: React.ReactNode }) => (
  <Button {...props}>
    <div className="flex items-center font-medium">
      <div className="flex justify-center items-center border border-[#CDCEEE] rounded-full h-10 w-10 mr-4">
        {icon}
      </div>
      {name}
    </div>
  </Button>
);

export const ButtonWithIconAndArrow = ({
  icon,
  name,
  ...props
}: ButtonProps & { icon: React.ReactNode }) => (
  <Button {...props}>
    <div className="flex items-center font-medium">
      <div className="flex justify-center items-center border border-[#CDCEEE] rounded-full h-10 w-10 mr-4">
        {icon}
      </div>
      {name}

      <div className="absolute right-4">
        <ArrowRight />
      </div>
    </div>
  </Button>
);
