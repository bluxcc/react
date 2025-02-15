import React, { useContext, useEffect } from 'react';

import Button from '../../../components/Button';
import { ProviderContext } from '../../../context/provider';

import { WhiteCheck } from '../../../assets/Icons';

const Connecting = () => {
  const context = useContext(ProviderContext);

  useEffect(() => {
    setTimeout(() => {
      context?.setValue((prev) => ({
        ...prev,
        openModal: false,
        connectSuccess: true,
        isAuthenticated: true,
      }));
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full select-none mt-8">
      <div
        className={`h-16 w-16 flex justify-center rounded-full overflow-hidden items-center bg-[#56C162] mb-4`}
      >
        <WhiteCheck />
      </div>

      <div className="space-y-3 w-full flex-col text-center font-semibold">
        <p className="text-xl">Connection Successful </p>
        <p className="text-sm text-center">Your account has been successfully connected.</p>
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
