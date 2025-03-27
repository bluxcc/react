import React from 'react';

import { useProvider } from '../../context/provider';
import getBorderRadius from '../../utils/getBorderRadius';

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
  borderRadius: string;
};

const CustomButton = ({ button, onButtonClick, borderRadius }: CustomButtonProps) => (
  <button
    onClick={onButtonClick}
    style={{ borderRadius }}
    className="bg-white border border-primary-100 text-primary-500 text-sm font-semibold px-3 py-1"
  >
    {button}
  </button>
);

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
  const borderRadius = getBorderRadius(context.value.config.appearance.cornerRadius);

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label
          className={`flex justify-between text-sm ml-2 mb-1 ${
            error ? 'text-alert-error' : 'text-gray-800'
          }`}
        >
          <span>{label}</span>
          <span>{customLabel}</span>
        </label>
      )}
      <div
        className={`flex items-center h-14 w-full border px-4 py-2 transition-all 
        ${error ? 'border-alert-error' : 'border-primary-100 focus-within:ring-1'} 
        `}
        style={
          {
            '--tw-ring-color': !error && context.value.config.appearance.accent,
            borderRadius,
          } as React.CSSProperties
        }
      >
        {iconLeft && <div className="mr-2">{iconLeft}</div>}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          className="bg-transparent outline-none text-gray-700 placeholder-gray-500 w-[90%] mr-2"
          onChange={onChange}
        />
        {button && (
          <CustomButton button={button} onButtonClick={onButtonClick} borderRadius={borderRadius} />
        )}
        {iconRight && <div className="ml-2">{iconRight}</div>}
      </div>
      {error && <p className={`text-xs mt-1 ml-2 text-alert-error`}>{error}</p>}
    </div>
  );
};

export default InputField;
