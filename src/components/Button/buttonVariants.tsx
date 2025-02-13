import React, { useContext } from 'react';

import Button, { ButtonProps } from './index';
import { ArrowRight } from '../../assets/Icons';
import { ProviderContext } from '../../context/provider';
import { getBorderRadius } from '../../utils/getBorderRadius';

import { CornerRadius } from '../../types';
import { defaultAppearance } from '../../constants/defaultAppearance';

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  name: string;
}

const IconContainer: React.FC<{
  children: React.ReactNode;
  cornerRadius?: CornerRadius;
}> = ({ children }) => {
  const context = useContext(ProviderContext);
  const appearance = context?.value?.appearance || defaultAppearance;

  return (
    <div
      style={{
        borderRadius: getBorderRadius(appearance.cornerRadius),
      }}
      className={`flex justify-center items-center border border-primary-100 h-10 w-10 mr-4 overflow-hidden`}
    >
      {children}
    </div>
  );
};

export const ButtonWithIcon = ({ icon, name, ...props }: IconButtonProps) => {
  return (
    <Button {...props}>
      <div className="flex items-center font-medium">
        <IconContainer>{icon}</IconContainer>
        {name}
      </div>
    </Button>
  );
};

export const ButtonWithIconAndArrow = ({ icon, name, ...props }: IconButtonProps) => {
  return (
    <Button {...props}>
      <div className="flex items-center font-medium w-full">
        <IconContainer>{icon}</IconContainer>
        {name}
        <div className="absolute right-4">
          <ArrowRight />
        </div>
      </div>
    </Button>
  );
};
