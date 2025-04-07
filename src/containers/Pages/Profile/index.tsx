import React, { useEffect, useState } from 'react';

import Button from '../../../components/Button';
import CardItem from '../../../components/CardItem';

import { useBlux } from '../../../hooks/useBlux';
import { useProvider } from '../../../context/provider';

import copyText from '../../../utils/copyText';
import shortenAddress from '../../../utils/shortenAddress';

import { Routes } from '../../../types';
import { Copy, History, LogOut, Send } from '../../../assets/Icons';
import useAccount from '../../../hooks/useAccount';
import humanizeAmount from '../../../utils/humanizeAmount';

const Profile = () => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const { disconnect } = useBlux();
  const [address, setAddress] = useState(context.value.user.wallet?.address || '');
  const { account } = useAccount({
    publicKey: context.value.user.wallet?.address as string,
    passphrase: context.value.config.networks[0], // todo: fix network
  });

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
      <p className="text-center" style={{ color: appearance.accent }}>
        {account ? humanizeAmount(account.xlmBalance) : 'N/A'} XLM
      </p>

      <div className="space-y-2 mt-[16px] w-full">
        <CardItem
          endArrow
          label="Send"
          startIcon={<Send fill={appearance.accent} />}
          onClick={() => {
            context.setRoute(Routes.SEND);
          }}
        />
        <CardItem
          endArrow
          label="Activity"
          startIcon={<History fill={appearance.accent} />}
          onClick={() => {
            context.setRoute(Routes.ACTIVITY);
          }}
        />
      </div>

      {/* divider */}
      <div className="w-full flex justify-center items-center h-8">
        <div className="absolute left-0 right-0 bg-primary-100 h-[1px]" />
      </div>

      <Button
        size="medium"
        variant="text"
        state="enabled"
        startIcon={<LogOut />}
        className="!text-gray-600"
        onClick={handleDisconnect}
      >
        Disconnect
      </Button>
    </div>
  );
};

export default Profile;
