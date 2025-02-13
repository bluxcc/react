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
    }, 700);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center w-full select-none mt-8">
      <div
        style={{
          background: context?.value.appearance.accent,
        }}
        className={`h-16 w-16 flex justify-center rounded-full overflow-hidden items-center mb-4`}
      >
        <WhiteCheck />
      </div>

      <div className="space-y-3 w-full flex-col text-center font-semibold">
        <p className="text-xl">Connection Successful </p>
        <p className="text-sm text-center">Your account has been successfully connected.</p>
      </div>

      <Button disabled className="cursor-default flex justify-center items-center mt-4">
        <p>Logging In</p>
      </Button>
    </div>
  );
};

export default Connecting;
