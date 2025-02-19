import React, { useEffect, useState } from 'react';

import Button from '../../../components/Button';
import CardItem from '../../../components/CardItem';

import { useBlux } from '../../../hooks/useBlux';
import { useProvider } from '../../../context/provider';

import { copyText } from '../../../utils/copyText';
import { shortenAddress } from '../../../utils/shortenAddress';

import { Routes } from '../../../types';
import { Copy, History, LogOut, Send } from '../../../assets/Icons';
import useAccount from '../../../hooks/useAccount';
import humanizeAmount from '../../../utils/humanizeAmount';

const Profile = () => {
  const context = useProvider();
  const { disconnect } = useBlux();
  const [address, setAddress] = useState(context.value.user.wallet?.address || '');
  const { account } = useAccount(
    context.value.user.wallet?.address as string,
    context.value.config.networkPassphrase,
  );

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
        {address ? shortenAddress(address, 5) : ''}
        <Copy />
      </p>
      <p className="text-primary-500 text-center">
        {account ? humanizeAmount(account.xlmBalance) : 'N/A'} XLM
      </p>

      <div className="space-y-2 mt-[16px] w-full">
        <CardItem
          endArrow
          label="Send"
          startIcon={<Send />}
          onClick={() => {
            context.setRoute(Routes.SEND);
          }}
        />
        <CardItem
          endArrow
          label="Activity"
          startIcon={<History />}
          onClick={() => {
            context.setRoute(Routes.ACTIVITY);
          }}
        />
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
      >
        Disconnect
      </Button>
    </div>
  );
};

export default Profile;
