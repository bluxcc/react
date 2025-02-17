import React from 'react';

import { getBorderRadius } from '../../utils/getBorderRadius';
import { useProvider } from '../../context/provider';

import { ArrowRight } from '../../assets/Icons';

type CardItemProps = {
  variant?: 'social' | 'default';
  startIcon: React.ReactNode;
  endArrow?: boolean;
  label: string;
  onClick?: () => void;
};

const CardItem = ({ variant = 'default', startIcon, endArrow, label, onClick }: CardItemProps) => {
  const context = useProvider();
  const modalStyle = context.value.appearance;
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full pl-[10px] h-14 pr-3 py-2 transition-all text-gray-950
        ${variant === 'social' ? 'border border-gray-300' : 'border border-primary-100'}`}
      style={{
        borderRadius: getBorderRadius(modalStyle.cornerRadius),
        color: modalStyle.textColor,
      }}
      onMouseEnter={(e) => {
        if (variant === 'default') {
          e.currentTarget.style.borderColor = modalStyle.accent;
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'default') {
          e.currentTarget.style.borderColor = '#cdceee';
        }
      }}
    >
      <span
        style={{ borderRadius: getBorderRadius(modalStyle.cornerRadius) }}
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
