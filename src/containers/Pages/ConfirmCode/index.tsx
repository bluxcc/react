import React from 'react';
import { EmailIcon } from '../../../assets/Icons';
import Button from '../../../components/Button';
import { useProvider } from '../../../context/provider';
import OTPInput from '../../../components/Input/OTPInput';

const ConfirmCode = () => {
  const context = useProvider();
  console.log(context.value.user.email);
  const handleSendCode = () => {};

  return (
    <div className="flex flex-col items-center justify-center w-full select-none mt-4">
      <div className="h-20 w-20 flex justify-center border-2 rounded-full overflow-hidden items-center mb-6 border-primary-100">
        <EmailIcon />
      </div>

      <div className="space-y-1 flex-col text-center">
        <p className="text-xl font-medium">Enter confirmation code</p>
        <p className="text-sm">Please check your email and enter confirmation code below</p>
      </div>

      <div className="mt-6">
        <OTPInput />
      </div>

      {/* divider */}
      <div className="w-full flex justify-center items-center h-8">
        <div className="absolute left-0 right-0 bg-primary-100 h-[1px]" />
      </div>

      <Button
        size="medium"
        state="enabled"
        variant="text"
        onClick={handleSendCode}
        className="!text-primary-500"
      >
        Resend code
      </Button>
    </div>
  );
};

export default ConfirmCode;
