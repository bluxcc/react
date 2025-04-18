import React, { useState, useEffect } from 'react';
import { EmailIcon } from '../../../assets/Icons';
import Button from '../../../components/Button';
import { useProvider } from '../../../context/provider';
import OTPInput from '../../../components/Input/OTPInput';

const ConfirmCode: React.FC = () => {
  const { value } = useProvider();
  const appearance = value.config.appearance;

  const email = value.user.email;
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState(false);

  const handleResendCode = () => {};

  const verifyOTPRequest = async (otp: string): Promise<void> => {
    setError(false);
    const isValid = await new Promise<boolean>((res) => {
      setTimeout(() => {
        res(otp === '123456');
      }, 200);
    });

    if (!isValid) {
      setError(true);
      setTimeout(() => setOtp(Array(6).fill('')), 1000); // Clear OTP after 1 second
    }
  };

  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      verifyOTPRequest(otpValue);
    }
  }, [otp, email]);

  return (
    <div className="bluxcc-mt-4 bluxcc-flex bluxcc-w-full bluxcc-select-none bluxcc-flex-col bluxcc-items-center bluxcc-justify-center">
      <div
        style={{
          borderColor: appearance.borderColor,
          borderWidth: appearance.borderWidth,
        }}
        className="bluxcc-mb-6 bluxcc-flex bluxcc-h-20 bluxcc-w-20 bluxcc-items-center bluxcc-justify-center bluxcc-overflow-hidden bluxcc-rounded-full bluxcc-border-2"
      >
        <EmailIcon fill={appearance.textColor} />
      </div>

      <div className="bluxcc-flex-col bluxcc-space-y-1 bluxcc-text-center">
        <p className="bluxcc-text-xl bluxcc-font-medium">
          Enter confirmation code
        </p>
        {error ? (
          <p className="bluxcc-flex bluxcc-h-10 bluxcc-items-center bluxcc-justify-center bluxcc-text-sm bluxcc-text-alert-error">
            Invalid code, please try again.
          </p>
        ) : (
          <p className="bluxcc-h-10 bluxcc-text-sm">
            Please check your email and enter confirmation code below
          </p>
        )}
      </div>

      <div className="bluxcc-mt-6 bluxcc-text-center">
        <OTPInput otp={otp} setOtp={setOtp} error={error} />
      </div>

      {/* Divider */}
      <div className="bluxcc-flex bluxcc-h-8 bluxcc-w-full bluxcc-items-center bluxcc-justify-center">
        <div
          className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0"
          style={{
            background: appearance.borderColor,
            height: appearance.includeBorders ? appearance.borderWidth : '1px',
          }}
        />
      </div>

      <Button
        size="medium"
        state="enabled"
        variant="text"
        onClick={handleResendCode}
        style={{
          color: appearance.accent,
        }}
      >
        Resend code
      </Button>
    </div>
  );
};

export default ConfirmCode;
