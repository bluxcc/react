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
      <div className="size-[73px] rounded-full bg-lightBlue-200" />
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
      <div className="w-full my-3">
        <div className="absolute left-0 right-0 bg-primary-100 h-[1px]" />
      </div>

      <Button
        size="medium"
        variant="text"
        state="enabled"
        onClick={handleDisconnect}
        style={{
          background: modalStyle.accent,
          borderRadius: getBorderRadius(modalStyle.cornerRadius),
        }}
        className="font-medium w-full inline-flex justify-center items-center gap-[10px] border-none text-white"
      >
        Disconnect
      </Button>
    </div>
  );
};

export default Profile;
