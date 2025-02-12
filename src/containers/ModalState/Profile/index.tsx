import React, { useContext, useEffect, useState } from 'react';

import copyText from '../../../utils/copyText';
import Button from '../../../components/Button';
import { useBlux } from '../../../hooks/useBlux';
import shortenAddress from '../../../utils/shortenAddress';

import { ProviderContext } from '../../../context/provider';
import { defaultAppearance } from '../../../constants/defaultAppearance';
import { getBorderRadius } from '../../../utils/getBorderRadius';

const Profile = () => {
  const context = useContext(ProviderContext);
  const { disconnect } = useBlux();
  const modalStyle = context?.value.appearance || defaultAppearance;
  const [address, setAddress] = useState(context?.value.user.wallet?.address || '');

  useEffect(() => {
    setAddress(context?.value.user.wallet?.address as string);
  }, [context?.value.user.wallet?.address]);

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="flex flex-col items-center justify-center">
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
        {shortenAddress(address, 5)}
      </p>
      <Button
        onClick={handleDisconnect}
        style={{
          background: modalStyle.accent,
          borderRadius: getBorderRadius(modalStyle.cornerRadius),
        }}
        className="mt-8 font-medium w-full inline-flex justify-center items-center gap-[10px] border-none text-white"
      >
        Disconnect
      </Button>
    </div>
  );
};

export default Profile;
