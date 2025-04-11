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
      className={`bluxcc-flex !bluxcc-h-14 bluxcc-w-full bluxcc-items-center bluxcc-border bluxcc-px-[10px] bluxcc-py-2 bluxcc-transition-all bluxcc-duration-300 ${
        variant === 'input' ? 'bluxcc-cursor-text' : 'bluxcc-cursor-pointer'
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
        className="bluxcc-flex bluxcc-size-10 bluxcc-flex-shrink-0 bluxcc-items-center bluxcc-justify-center bluxcc-overflow-hidden bluxcc-border bluxcc-border-primary-100 bluxcc-transition-all bluxcc-duration-300"
      >
        {startIcon}
      </span>

      <div className="bluxcc-relative bluxcc-ml-4 bluxcc-mr-1 bluxcc-flex bluxcc-h-full bluxcc-flex-1 bluxcc-items-center">
        {variant === 'input' ? (
          <>
            <input
              type={inputType}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Email"
              className="bluxcc-mr-1 bluxcc-h-full bluxcc-w-full bluxcc-bg-transparent bluxcc-outline-none placeholder:bluxcc-text-gray-400 focus:bluxcc-outline-none"
              style={{ color: appearance.textColor }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                if (!validateInput(inputValue)) {
                  setIsValid(false);
                }
              }}
            />
            <div className="bluxcc-flex bluxcc-h-10 bluxcc-w-[100px] bluxcc-items-center bluxcc-justify-center bluxcc-bg-transparent">
              <button
                disabled={!isValid}
                onClick={() => onSubmit?.(inputValue)}
                style={{
                  borderRadius,
                  color: isValid ? appearance.accent : '#9ca3af',
                  borderColor: isValid ? appearance.accent : '#CDCEEE',
                }}
                className={`bluxcc-!w-[68px] bluxcc-absolute bluxcc-right-0 bluxcc-flex bluxcc-h-8 bluxcc-items-center bluxcc-justify-center bluxcc-border bluxcc-bg-transparent bluxcc-text-sm bluxcc-font-medium bluxcc-transition-all bluxcc-duration-300`}
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <span className="bluxcc-select-none bluxcc-font-medium">{label}</span>
        )}
      </div>

      {endArrow && (
        <span className="bluxcc-ml-auto bluxcc-mr-1 bluxcc-flex bluxcc-items-center">
          <ArrowRight fill={appearance.textColor} />
        </span>
      )}
    </div>
  );
};

export default CardItem;
