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
  onSubmit?: (value: string) => void;
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
  onSubmit,
  inputType = 'text',
}: CardItemProps) => {
  const context = useProvider();
  const { appearance } = context.value.config;
  const borderRadius = getBorderRadius(appearance.cornerRadius);
  const [inputValue, setInputValue] = useState(label || '');
  const [isValid, setIsValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const validateInput = (value: string) => {
    if (inputType === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    return value.trim() !== '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsValid(validateInput(value));
    onChange?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid) {
      onEnter?.(inputValue);
    }
  };

  const onMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (variant !== 'social' && !isFocused) {
      e.currentTarget.style.borderColor = appearance.accent;
    }
  };
  const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (variant !== 'social' && !isFocused) {
      e.currentTarget.style.borderColor = '#cdceee';
    }
  };

  return (
    <div
      onClick={variant === 'input' ? undefined : onClick}
      className={`flex items-center w-full h-14 border transition-all px-[10px] py-2 ${
        variant === 'input' ? 'cursor-text' : 'cursor-pointer'
      }`}
      style={{
        borderRadius,
        color: appearance.textColor,
        borderColor: isFocused ? appearance.accent : '#cdceee',
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

      <div className="relative flex-1 flex items-center ml-4 mr-1">
        {variant === 'input' ? (
          <>
            <input
              type={inputType}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Email"
              className="bg-transparent outline-none placeholder:text-gray-600 w-full mr-1"
              style={{ color: appearance.textColor }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                if (!validateInput(inputValue)) {
                  setIsValid(false);
                }
              }}
            />
            <div className="bg-transparent w-[100px] h-10 flex justify-center items-center">
              <button
                disabled={!isValid}
                onClick={() => onSubmit?.(inputValue)}
                style={{
                  borderRadius,
                  color: isValid ? appearance.accent : '#9ca3af',
                  borderColor: isValid ? appearance.accent : '#9ca3af',
                }}
                className={`absolute right-0 bg-white border text-sm font-medium flex justify-center items-center h-8 !w-[68px]`}
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <span className="font-medium">{label}</span>
        )}
      </div>

      {endArrow && (
        <span className="ml-auto mr-1 flex items-center">
          <ArrowRight />
        </span>
      )}
    </div>
  );
};

export default CardItem;
