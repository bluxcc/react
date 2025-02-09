import React, { useContext } from 'react';

import { ProviderContext, defaultAppearance } from '../../../context/provider';
import copyText from '../../../utils/copyText';
import shortenAddress from '../../../utils/shortenAddress';
import Button from '../../../components/Button';

const Profile = () => {
  const context = useContext(ProviderContext);
  const modalStyle = context?.value.appearance || defaultAppearance;

  const handleDisconnect = () => {
    context?.setValue((prev) => ({
      ...prev,
      user: {
        wallet: null,
      },
      openModal: false,
      isConnecting: false,
      isAuthenticated: false,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center pb-5">
      <div
        className="w-20 h-20 rounded-full"
        style={{
          background: modalStyle.accent,
        }}
      ></div>
      <p className="text-xl font-medium mt-3 mb-1">
        Connected to {context?.value.user.wallet?.name}
      </p>
      <p
        className="text-base cursor-pointer"
        style={{ color: modalStyle.accent }}
        onClick={() => {
          copyText(context?.value.user.wallet?.address as string);
        }}
      >
        {shortenAddress(context?.value.user.wallet?.address as string)}
      </p>
      <Button
        disabled
        onClick={handleDisconnect}
        className="mt-8 font-medium w-full inline-flex justify-center items-center gap-[10px] border-none text-white bg-gray-400 cursor-disabled"
      >
        Disconnect
      </Button>
    </div>
  );
};

export default Profile;
