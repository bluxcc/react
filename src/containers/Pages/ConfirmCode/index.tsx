import React, { useState, useEffect } from 'react';
import { useLang } from '../../../hooks/useLang';
import Button from '../../../components/Button';
import { EmailIcon } from '../../../assets/Icons';
import { useProvider } from '../../../context/provider';
import OTPInput from '../../../components/Input/OTPInput';

const ConfirmCode: React.FC = () => {
  const { value } = useProvider();
  const appearance = value.config.appearance;
  const t = useLang();

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
      setTimeout(() => setOtp(Array(6).fill('')), 1000);
    }
  };

  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      verifyOTPRequest(otpValue);
    }
  }, [otp, email]);

  return (
    <div className="bluxcc:mt-4 bluxcc:flex bluxcc:w-full bluxcc:flex-col bluxcc:items-center bluxcc:justify-center bluxcc:select-none">
      <div
        style={{
          borderColor: appearance.borderColor,
          borderWidth: appearance.includeBorders
            ? appearance.borderWidth
            : '1px',
        }}
        className="bluxcc:mb-6 bluxcc:flex bluxcc:h-20 bluxcc:w-20 bluxcc:items-center bluxcc:justify-center bluxcc:overflow-hidden bluxcc:rounded-full bluxcc:border-2"
      >
        <EmailIcon fill={appearance.textColor} />
      </div>

      <div className="bluxcc:flex-col bluxcc:space-y-1 bluxcc:text-center">
        <p className="bluxcc:text-xl bluxcc:font-medium">
          {t('enterConfirmationCodeTitle')}
        </p>
        {error ? (
          <p className="bluxcc:flex bluxcc:h-10 bluxcc:items-center bluxcc:justify-center bluxcc:text-sm bluxcc:text-alert-error">
            {t('invalidCodeError')}
          </p>
        ) : (
          <p className="bluxcc:h-10 bluxcc:text-sm">
            {t('enterConfirmationCodeHelp')}
          </p>
        )}
      </div>

      <div className="bluxcc:mt-6 bluxcc:text-center">
        <OTPInput otp={otp} setOtp={setOtp} error={error} />
      </div>

      {/* divider */}
      <div className="bluxcc:flex bluxcc:h-8 bluxcc:w-full bluxcc:items-center bluxcc:justify-center">
        <div
          className="bluxcc:absolute bluxcc:right-0 bluxcc:left-0"
          style={{
            borderTopWidth: appearance.includeBorders
              ? appearance.borderWidth
              : '1px',
            borderTopColor: appearance.borderColor,
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
        {t('resendCode')}
      </Button>
    </div>
  );
};

export default ConfirmCode;
