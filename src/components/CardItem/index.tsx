import React, { useState, MouseEvent } from 'react';
import { useProvider } from '../../context/provider';
import { ArrowRight } from '../../assets/Icons';
import hexToRgba from '../../utils/hexToRgba';
import { useLang } from '../../hooks/useLang';

type CardItemProps = {
  variant?: 'social' | 'default' | 'input';
  size?: 'small' | 'medium';
  startIcon: React.ReactNode;
  endArrow?: boolean;
  isRecent?: boolean;
  label?: string;
  onClick?: () => void;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
  onSubmit?: (value: string) => void;
  inputType?: 'text' | 'password' | 'number' | 'email' | string;
};

const CardItem = ({
  variant = 'default',
  size = 'medium',
  startIcon,
  endArrow,
  isRecent,
  label,
  onClick,
  onChange,
  onEnter,
  onSubmit,
  inputType = 'text',
}: CardItemProps) => {
  const context = useProvider();
  const { appearance } = context.value.config;
  const t = useLang();

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
      e.currentTarget.style.transition = 'border-color 0.35s ease-in-out';
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
      className={`bluxcc:flex ${
        variant === 'input' ? 'bluxcc:cursor-text' : 'bluxcc:cursor-pointer'
      } ${
        size === 'small'
          ? 'bluxcc:size-[96px] bluxcc:flex-col bluxcc:items-center bluxcc:justify-center bluxcc:py-4'
          : 'bluxcc:!h-14 bluxcc:w-full bluxcc:items-center bluxcc:py-2 bluxcc:pr-3.5 bluxcc:pl-[10px]'
      }`}
      style={{
        borderRadius: appearance.borderRadius,
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
          backgroundColor: appearance.background,
          borderRadius: appearance.borderRadius,
          borderColor: appearance.borderColor,
          borderWidth: appearance.includeBorders
            ? appearance.borderWidth
            : '1px',
        }}
        className="bluxcc:flex bluxcc:size-10 bluxcc:shrink-0 bluxcc:items-center bluxcc:justify-center bluxcc:overflow-hidden bluxcc:transition-[border-radius] bluxcc:duration-300"
      >
        {startIcon}
      </span>

      <div
        className={`${
          size === 'small' ? 'bluxcc:mt-[3px]' : 'bluxcc:ml-4'
        } bluxcc:relative bluxcc:flex bluxcc:h-full bluxcc:flex-1 bluxcc:items-center`}
      >
        {variant === 'input' ? (
          <>
            <input
              id="bluxcc-input"
              type={inputType}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t('email')}
              className="bluxcc:mr-1 bluxcc:h-full bluxcc:w-full bluxcc:bg-transparent bluxcc:outline-hidden bluxcc:focus:outline-hidden"
              style={{ color: appearance.textColor }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                if (!validateInput(inputValue)) {
                  setIsValid(false);
                }
              }}
            />
            <div className="bluxcc:flex bluxcc:h-10 bluxcc:w-[100px] bluxcc:items-center bluxcc:justify-center bluxcc:bg-transparent">
              <button
                disabled={!isValid}
                onClick={() => onSubmit?.(inputValue)}
                className={`bluxcc:absolute bluxcc:right-0 bluxcc:flex bluxcc:h-8 bluxcc:w-[68px]! bluxcc:items-center bluxcc:justify-center bluxcc:border bluxcc:!text-sm bluxcc:font-medium bluxcc:transition-[border-radius,background,border-color] bluxcc:duration-200`}
                style={{
                  background: appearance.bgField,
                  borderRadius: appearance.borderRadius,
                  borderColor: isValid
                    ? appearance.accent
                    : appearance.borderColor,
                  color: isValid ? appearance.accent : '#999999',
                  borderWidth: appearance.includeBorders
                    ? appearance.borderWidth
                    : '1px',
                }}
              >
                {t('submit')}
              </button>
            </div>
          </>
        ) : (
          <span
            className={`${
              size === 'small' ? 'bluxcc:text-sm' : 'bluxcc:text-base'
            } bluxcc:font-medium bluxcc:select-none`}
          >
            {label}
          </span>
        )}
      </div>
      {isRecent && (
        <div
          className={`bluxcc:px-2 bluxcc:py-1 bluxcc:text-xs bluxcc:font-normal`}
          style={{
            color: appearance.accent,
            borderRadius: appearance.borderRadius,
            backgroundColor: `${hexToRgba(appearance.accent, 0.1)}`,
          }}
        >
          {t('recent')}
        </div>
      )}

      {endArrow && size === 'medium' && (
        <span className="bluxcc:ml-auto bluxcc:flex bluxcc:items-center">
          <ArrowRight fill={`${hexToRgba(appearance.textColor, 0.7)}`} />
        </span>
      )}
    </div>
  );
};

export default CardItem;
