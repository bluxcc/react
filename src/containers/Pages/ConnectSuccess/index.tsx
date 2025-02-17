import React, { useEffect } from 'react';

import Button from '../../../components/Button';

import { GreenCheck } from '../../../assets/Icons';
import { useBluxProvider } from '../../../context/bluxProvider';

const Connecting = () => {
  const context = useBluxProvider();

  useEffect(() => {
    setTimeout(() => {
      context.setValue((prev) => ({
        ...prev,
        openModal: false,
        connectSuccess: true,
        isAuthenticated: true,
      }));
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full select-none mt-4">
      <div className={`size-12 flex justify-center rounded-full overflow-hidden items-center mb-6`}>
        <GreenCheck />
      </div>

      <div className="space-y-1 w-full flex-col text-center">
        <p className="text-xl font-semibold">Connection Successful </p>
        <p className="text-sm text-center font-medium leading-5">
          Your account has been successfully connected.
        </p>
      </div>

      <div className="w-full my-4">
        <div className="absolute left-0 right-0 bg-primary-100 h-[1px]" />
      </div>

      <Button
        state="enabled"
        variant="outline"
        className="cursor-default flex justify-center items-center"
      >
        <p>Logging In</p>
      </Button>
    </div>
  );
};

export default Connecting;
