import React, { useState, useRef, ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { useProvider } from '../../context/provider';
import getBorderRadius from '../../utils/getBorderRadius';

const OTPInput: React.FC = () => {
  const LENGTH = 6;
  const {
    value: { appearance },
  } = useProvider();
  const [otp, setOtp] = useState<string[]>(Array(LENGTH).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const borderRadius = getBorderRadius(appearance.cornerRadius);
  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);

    if (index < LENGTH - 1 && value) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);

    if (!pasteData) return;

    const newOtp = [...pasteData.split(''), ...Array(LENGTH - pasteData.length).fill('')];

    setOtp(newOtp);

    setTimeout(() => inputsRef.current[LENGTH - 1]?.focus(), 0);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];

      if (newOtp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const getInputStyle = (digit: string): React.CSSProperties => ({
    borderRadius: borderRadius,
    color: appearance.textColor,
    background: appearance.background,
    borderColor: digit ? appearance.accent : '#cdceee',
  });

  return (
    <div className="flex gap-1">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onPaste={handlePaste}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-14 text-center text-lg outline-none border"
          style={getInputStyle(digit)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
