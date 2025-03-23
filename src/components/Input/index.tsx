import React from 'react';

import { useProvider } from '../../context/provider';
import getBorderRadius from '../../utils/getBorderRadius';

type InputFieldProps = {
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
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
  placeholder = 'Input',
  error,
  helperText,
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
            error ? 'text-lightRed-300' : 'text-gray-800'
          }`}
        >
          <span>{label}</span>
          <span>{customLabel}</span>
        </label>
      )}
      <div
        className={`flex items-center w-full border px-3 py-2 transition-all 
        ${error ? 'border-lightRed-300' : 'border-primary-100'} 
        focus-within:ring-1`}
        style={
          {
            '--tw-ring-color': context.value.config.appearance.accent,
            borderRadius,
          } as React.CSSProperties
        }
      >
        {iconLeft && <div className="mr-2">{iconLeft}</div>}
        <input
          type="text"
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
      {helperText && (
        <p className={`text-xs mt-1 ${error ? 'text-lightRed-300' : 'text-gray-400'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default InputField;
