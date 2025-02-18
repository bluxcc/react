import React from 'react';

type InputFieldProps = {
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = 'Input',
  error,
  helperText,
  iconRight,
  iconLeft,
  buttonText,
  onButtonClick,
  value,
  onChange,
}) => {
  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className={`text-sm mb-1 ${error ? 'text-lightRed-300' : 'text-gray-300'}`}>
          {label}
        </label>
      )}
      <div
        className={`flex items-center w-full border rounded-full px-3 py-2 transition-all 
          ${error ? 'border-lightRed-300' : 'border-primary-number'} 
          focus-within:ring-2 focus-within:ring-primary-number`}
      >
        {iconLeft && <div className="mr-2 text-gray-400">{iconLeft}</div>}
        <input
          type="text"
          className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="ml-2 bg-white text-primary-number text-sm font-semibold px-3 py-1 rounded-full"
          >
            {buttonText}
          </button>
        )}
        {iconRight && <div className="ml-2 text-gray-400">{iconRight}</div>}
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
