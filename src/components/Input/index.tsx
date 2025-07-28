import React, { useState, MouseEvent } from 'react';

import { useProvider } from '../../context/provider';
import { IAppearance } from '../../types';

type InputFieldProps = {
  label?: string;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'password' | 'number';
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  button?: string | React.ReactNode;
  onButtonClick?: () => void;
  value?: string;
  autoFocus?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customLabel?: React.ReactNode;
  className?: string;
};

type CustomButtonProps = {
  button: string | React.ReactNode;
  onButtonClick?: () => void;
  appearance: IAppearance;
};

const CustomButton = ({
  button,
  onButtonClick,
  appearance,
}: CustomButtonProps) => {
  return (
    <button
      onClick={onButtonClick}
      style={{
        borderRadius: appearance.borderRadius,
        color: appearance.textColor,
        borderColor: appearance.borderColor,
        backgroundColor: appearance.background,
        borderWidth: appearance.includeBorders ? appearance.borderWidth : '1px',
      }}
      className="bluxcc:border bluxcc:!px-3 bluxcc:!py-1 bluxcc:!text-sm bluxcc:font-medium bluxcc:transition-all bluxcc:duration-300"
    >
      {button}
    </button>
  );
};

const InputField = ({
  label,
  autoFocus,
  type = 'text',
  placeholder = 'Input',
  error,
  iconRight,
  iconLeft,
  button,
  onButtonClick,
  customLabel,
  value,
  className,
  onChange,
}: InputFieldProps) => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const [isFocused, setIsFocused] = useState(false);

  const onMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (!isFocused && !error) {
      e.currentTarget.style.borderColor = appearance.accent;
      e.currentTarget.style.transition = 'border-color 0.35s ease-in-out';
    }
  };

  const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!isFocused) {
      e.currentTarget.style.borderColor = error
        ? '#ec2929'
        : appearance.borderColor;
    }
  };

  const getBorderAndRingColor = () => {
    if (error) return '#ec2929';
    if (isFocused) return appearance.accent;
    return appearance.borderColor;
  };

  return (
    <div className="bluxcc:flex bluxcc:w-full bluxcc:flex-col">
      {label && (
        <label
          style={{ color: error ? '#ec2929' : appearance.textColor }}
          className={`bluxcc:mb-1 bluxcc:ml-2 bluxcc:flex bluxcc:justify-between bluxcc:text-sm`}
        >
          <span>{label}</span>
          <span>{customLabel}</span>
        </label>
      )}
      <div
        className={`bluxcc:flex bluxcc:h-14 bluxcc:w-full bluxcc:items-center bluxcc:border bluxcc:px-4 bluxcc:py-2 bluxcc:transition-all bluxcc:duration-300 ${className}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={
          {
            '--tw-ring-color': getBorderAndRingColor(),
            borderRadius: appearance.borderRadius,
            borderColor: getBorderAndRingColor(),
            backgroundColor: appearance.bgField,
            borderWidth: appearance.includeBorders
              ? appearance.borderWidth
              : '1px',
          } as React.CSSProperties
        }
      >
        {iconLeft && <div className="bluxcc:mr-2">{iconLeft}</div>}
        <input
          id="bluxcc-input"
          autoComplete="off"
          min={type === 'number' ? 1 : undefined}
          type={type}
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          className="bluxcc:!mr-2 bluxcc:bg-transparent bluxcc:outline-hidden"
          style={{
            color: appearance.textColor,
            width: !button ? '100%' : '90%',
          }}
          onChange={onChange}
        />
        {button && (
          <CustomButton
            button={button}
            onButtonClick={onButtonClick}
            appearance={appearance}
          />
        )}
        {iconRight && <div className="bluxcc:ml-2">{iconRight}</div>}
      </div>
      {error && (
        <p
          className={`bluxcc:mt-1 bluxcc:ml-2 bluxcc:text-xs bluxcc:text-alert-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
