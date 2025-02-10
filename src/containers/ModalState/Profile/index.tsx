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
      openModal: false,
      isConnecting: false,
      isAuthenticated: false,
      user: {
        wallet: null,
      },
    }));
    if (context?.value.isDemo) {
      setTimeout(() => {
        context?.setValue((prev) => ({
          ...prev,
          openModal: true,
        }));
      }, 100);
    }
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
        {shortenAddress(context?.value.user.wallet?.address || '', 5)}
      </p>
      <Button
        onClick={handleDisconnect}
        style={{
          background: modalStyle.accent,
        }}
        className="mt-8 font-medium w-full inline-flex justify-center items-center gap-[10px] border-none text-white"
      >
        Disconnect
      </Button>
    </div>
  );
};

export default Profile;
