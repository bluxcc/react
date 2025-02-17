import React, { useEffect, useState } from 'react';

import Button from '../../../components/Button';
import CardItem from '../../../components/CardItem';

import { useBlux } from '../../../hooks/useBlux';
import { useProvider } from '../../../context/provider';

import { copyText } from '../../../utils/copyText';
import { shortenAddress } from '../../../utils/shortenAddress';

import { Copy, History, LogOut, Send } from '../../../assets/Icons';

const Profile = () => {
  const context = useProvider();
  const { disconnect } = useBlux();
  const [address, setAddress] = useState(context.value.user.wallet?.address || '');

  useEffect(() => {
    setAddress(context.value.user.wallet?.address as string);
  }, [context.value.user.wallet?.address]);

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="size-[73px] rounded-full bg-lightBlue-200 mt-4" />
      <p
        className="inline-flex gap-1 text-base cursor-pointer text-gray-700 mt-6 mb-4"
        onClick={() => {
          copyText(context.value.user.wallet?.address as string);
        }}
      >
        {shortenAddress(address, 5)}
        <Copy />
      </p>
      <p className="text-primary-500 text-center">345.00 XLM</p>

      <div className="space-y-2 mt-[16px] w-full">
        <CardItem endArrow label="Send" startIcon={<Send />} onClick={() => {}} />
        <CardItem endArrow label="Activity" startIcon={<History />} onClick={() => {}} />
      </div>

      {/* divider */}
      <div className="w-full my-4">
        <div className="absolute left-0 right-0 bg-primary-100 h-[1px]" />
      </div>

      <Button
        size="medium"
        variant="text"
        state="enabled"
        startIcon={<LogOut />}
        onClick={handleDisconnect}
        className="font-medium w-full inline-flex justify-center items-center gap-[10px] border-none text-white"
      >
        Disconnect
      </Button>
    </div>
  );
};

export default Profile;
