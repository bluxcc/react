import React, { useState, useEffect } from 'react';
import { EmailIcon } from '../../../assets/Icons';
import Button from '../../../components/Button';
import { useProvider } from '../../../context/provider';
import OTPInput from '../../../components/Input/OTPInput';

const ConfirmCode: React.FC = () => {
  const { value } = useProvider();
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
    <div className="flex flex-col items-center justify-center w-full select-none mt-4">
      <div className="h-20 w-20 flex justify-center border-2 rounded-full overflow-hidden items-center mb-6 border-primary-100">
        <EmailIcon />
      </div>

      <div className="space-y-1 flex-col text-center">
        <p className="text-xl font-medium">Enter confirmation code</p>
        {error ? (
          <p className="text-alert-error text-sm">Invalid code, please try again.</p>
        ) : (
          <p className="text-sm">Please check your email and enter confirmation code below</p>
        )}
      </div>

      <div className="mt-6 text-center">
        <OTPInput otp={otp} setOtp={setOtp} error={error} />
      </div>

      {/* Divider */}
      <div className="w-full flex justify-center items-center h-8">
        <div className="absolute left-0 right-0 bg-primary-100 h-[0.75px]" />
      </div>

      <Button
        size="medium"
        state="enabled"
        variant="text"
        onClick={handleResendCode}
        className="!text-primary-500"
      >
        Resend code
      </Button>
    </div>
  );
};

export default ConfirmCode;
