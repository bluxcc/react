import React, { useContext } from 'react';

import Button, { ButtonProps } from './index';
import { ArrowRight } from '../../assets/Icons';
import { defaultAppearance } from '../../constants';
import { ProviderContext } from '../../context/provider';
import { getBorderRadius } from '../../utils/getBorderRadius';

import { CornerRadius } from '../../types';

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  name: string;
}

const IconContainer: React.FC<{
  children: React.ReactNode;
  cornerRadius?: CornerRadius;
}> = ({ children, cornerRadius = 'md' }) => {
  return (
    <div
      className={`flex justify-center items-center border border-slate-200 h-10 w-10 mr-4 rounded-${getBorderRadius(
        cornerRadius,
      )}`}
    >
      {children}
    </div>
  );
};

export const ButtonWithIcon: React.FC<IconButtonProps> = ({
  icon,
  name,
  className = '',
  ...props
}) => {
  const context = useContext(ProviderContext);
  const appearance = context?.value?.appearance || defaultAppearance;

  return (
    <Button className={className} {...props}>
      <div className="flex items-center font-medium">
        <IconContainer cornerRadius={appearance.cornerRadius}>{icon}</IconContainer>
        {name}
      </div>
    </Button>
  );
};

export const ButtonWithIconAndArrow: React.FC<IconButtonProps> = ({
  icon,
  name,
  className = '',
  ...props
}) => {
  const context = useContext(ProviderContext);
  const appearance = context?.value?.appearance || defaultAppearance;

  return (
    <Button className={className} {...props}>
      <div className="flex items-center font-medium w-full">
        <IconContainer cornerRadius={appearance.cornerRadius}>{icon}</IconContainer>
        {name}
        <div className="absolute right-4">
          <ArrowRight />
        </div>
      </div>
    </Button>
  );
};
