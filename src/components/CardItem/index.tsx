import React, { useState, MouseEvent } from 'react';
import getBorderRadius from '../../utils/getBorderRadius';
import { useProvider } from '../../context/provider';
import { ArrowRight } from '../../assets/Icons';

type CardItemProps = {
  variant?: 'social' | 'default' | 'input';
  startIcon: React.ReactNode;
  endArrow?: boolean;
  label?: string;
  onClick?: () => void;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
  inputType?: 'text' | 'password' | 'number' | 'email' | string;
};

const CardItem = ({
  variant = 'default',
  startIcon,
  endArrow,
  label,
  onClick,
  onChange,
  onEnter,
  inputType = 'text',
}: CardItemProps) => {
  const context = useProvider();
  const appearance = context.value.appearance;
  const borderRadius = getBorderRadius(appearance.cornerRadius);
  const [inputValue, setInputValue] = useState(label || '');
  const [isValid, setIsValid] = useState(true);

  const validateInput = (value: string) => {
    if (inputType === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    return value.trim() !== '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const valid = validateInput(value);
    setIsValid(valid);
    onChange?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid) {
      onEnter?.(inputValue);
    }
  };

  const onMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (variant !== 'social') {
      e.currentTarget.style.borderColor = appearance.accent;
    }
  };
  const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (variant !== 'social') {
      e.currentTarget.style.borderColor = '#cdceee';
    }
  };

  return (
    <div
      onClick={variant === 'input' ? undefined : onClick}
      className={`flex items-center w-full h-14 border border-primary-100 transition-all px-[10px] py-2 ${
        variant === 'input' ? 'cursor-text' : 'cursor-pointer'
      }`}
      style={{
        borderRadius,
        color: appearance.textColor,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        style={{ borderRadius }}
        className="flex-shrink-0 flex justify-center items-center border border-primary-100 size-10 overflow-hidden"
      >
        {startIcon}
      </span>

      <div className="flex-1 flex items-center ml-4">
        {variant === 'input' ? (
          <input
            type={inputType}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Email"
            className={`bg-transparent outline-none placeholder:text-gray-600 w-full focus:outline-none mr-2 ${
              isValid ? '' : 'text-red-500'
            }`}
            style={{ color: appearance.textColor }}
          />
        ) : (
          <span>{label}</span>
        )}
      </div>

      {endArrow && (
        <span className="ml-auto flex items-center">
          <ArrowRight />
        </span>
      )}
    </div>
  );
};

export default CardItem;
