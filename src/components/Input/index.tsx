import React from 'react';

import { useProvider } from '../../context/provider';
import getBorderRadius from '../../utils/getBorderRadius';
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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customLabel?: React.ReactNode;
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
        borderRadius: getBorderRadius(appearance.cornerRadius),
        color: appearance.accent,
        // borderColor: appearance.accent,
        backgroundColor: appearance.background,
      }}
      className="bluxcc-border bluxcc-border-primary-100 bluxcc-px-3 bluxcc-py-1 bluxcc-text-sm bluxcc-font-semibold bluxcc-transition-all bluxcc-duration-300"
    >
      {button}
    </button>
  );
};

const InputField = ({
  label,
  type = 'text',
  placeholder = 'Input',
  error,
  iconRight,
  iconLeft,
  button,
  onButtonClick,
  customLabel,
  value,
  onChange,
}: InputFieldProps) => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const borderRadius = getBorderRadius(
    context.value.config.appearance.cornerRadius,
  );

  return (
    <div className="bluxcc-flex bluxcc-w-full bluxcc-flex-col">
      {label && (
        <label
          className={`bluxcc-mb-1 bluxcc-ml-2 bluxcc-flex bluxcc-justify-between bluxcc-text-sm ${
            error ? 'bluxcc-text-alert-error' : 'bluxcc-text-gray-800'
          }`}
        >
          <span>{label}</span>
          <span>{customLabel}</span>
        </label>
      )}
      <div
        className={`bluxcc-flex bluxcc-h-14 bluxcc-w-full bluxcc-items-center bluxcc-border bluxcc-px-4 bluxcc-py-2 bluxcc-transition-all ${error ? 'bluxcc-border-alert-error' : 'bluxcc-border-primary-100 focus-within:bluxcc-ring-1'} `}
        style={
          {
            '--tw-ring-color': !error && context.value.config.appearance.accent,
            borderRadius,
          } as React.CSSProperties
        }
      >
        {iconLeft && <div className="bluxcc-mr-2">{iconLeft}</div>}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          className="bluxcc-mr-2 bluxcc-w-[90%] bluxcc-bg-transparent bluxcc-text-gray-700 bluxcc-outline-none placeholder:bluxcc-text-gray-500"
          style={{ color: appearance.textColor }}
          onChange={onChange}
        />
        {button && (
          <CustomButton
            button={button}
            onButtonClick={onButtonClick}
            appearance={appearance}
          />
        )}
        {iconRight && <div className="bluxcc-ml-2">{iconRight}</div>}
      </div>
      {error && (
        <p
          className={`bluxcc-ml-2 bluxcc-mt-1 bluxcc-text-xs bluxcc-text-alert-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
