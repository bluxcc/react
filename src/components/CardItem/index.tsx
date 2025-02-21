import React, { MouseEvent } from 'react';

import getBorderRadius from '../../utils/getBorderRadius';
import { useProvider } from '../../context/provider';

import { ArrowRight } from '../../assets/Icons';

type CardItemProps = {
  variant?: 'social' | 'default';
  startIcon: React.ReactNode;
  endArrow?: boolean;
  label: string;
  onClick?: () => void;
};

const CardItem: React.FC<CardItemProps> = ({
  variant = 'default',
  startIcon,
  endArrow,
  label,
  onClick,
}) => {
  const context = useProvider();
  const appearance = context.value.appearance;
  const borderRadius = getBorderRadius(appearance.cornerRadius);

  const onMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    if (variant === 'default') {
      e.currentTarget.style.borderColor = appearance.accent;
    }
  };
  const onMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    if (variant === 'default') {
      e.currentTarget.style.borderColor = '#cdceee';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full pl-[10px] h-14 pr-3 py-2 transition-all text-gray-950 border border-primary-100`}
      style={{
        borderRadius,
        color: appearance.textColor,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        style={{ borderRadius }}
        className="flex justify-center items-center border border-primary-100 size-10 overflow-hidden"
      >
        {startIcon}
      </span>
      <span className={`${variant === 'default' ? ' ml-4' : 'flex-1'}`}>{label}</span>
      {endArrow ? (
        <span className="ml-auto flex items-center">
          <ArrowRight />
        </span>
      ) : (
        <span className="size-10" />
      )}
    </button>
  );
};

export default CardItem;
