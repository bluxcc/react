import React, { useState, MouseEvent } from 'react';
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
      e.currentTarget.style.borderColor = appearance.borderColor;
    }
  };

  return (
    <div
      onClick={variant === 'input' ? undefined : onClick}
      className={`bluxcc-flex !bluxcc-h-14 bluxcc-w-full bluxcc-items-center bluxcc-border bluxcc-py-2 bluxcc-pl-[10px] bluxcc-pr-3 ${
        variant === 'input' ? 'bluxcc-cursor-text' : 'bluxcc-cursor-pointer'
      }`}
      style={{
        borderRadius: appearance.cornerRadius,
        color: appearance.textColor,
        borderColor: isFocused ? appearance.accent : appearance.borderColor,
        backgroundColor: appearance.bgField,
        borderWidth: appearance.includeBorders ? appearance.borderWidth : '1px',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        style={{
          borderRadius: appearance.cornerRadius,
          borderColor: appearance.borderColor,
          borderWidth: appearance.includeBorders
            ? appearance.borderWidth
            : '1px',
        }}
        className="bluxcc-flex bluxcc-size-10 bluxcc-flex-shrink-0 bluxcc-items-center bluxcc-justify-center bluxcc-overflow-hidden bluxcc-border bluxcc-transition-[border-radius] bluxcc-duration-300"
      >
        {startIcon}
      </span>

      <div className="bluxcc-relative bluxcc-ml-4 bluxcc-flex bluxcc-h-full bluxcc-flex-1 bluxcc-items-center">
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
                className={`bluxcc-absolute bluxcc-right-0 bluxcc-flex bluxcc-h-8 !bluxcc-w-[68px] bluxcc-items-center bluxcc-justify-center bluxcc-border bluxcc-bg-transparent bluxcc-text-sm bluxcc-font-medium bluxcc-transition-[border-radius,background,border-color] bluxcc-duration-150`}
                style={{
                  borderRadius: appearance.cornerRadius,
                  borderColor: isValid
                    ? appearance.accent
                    : appearance.borderColor,
                  color: isValid ? appearance.accent : '#999999',
                  borderWidth: appearance.includeBorders
                    ? appearance.borderWidth
                    : '1px',
                }}
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
        <span className="bluxcc-ml-auto bluxcc-flex bluxcc-items-center">
          <ArrowRight fill={appearance.textColor} />
        </span>
      )}
    </div>
  );
};

export default CardItem;
