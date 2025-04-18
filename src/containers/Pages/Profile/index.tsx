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
  const { logout } = useBlux();
  const [address, setAddress] = useState(
    context.value.user.wallet?.address || '',
  );
  const [copied, setCopied] = useState(false);
  const { account } = useAccount({
    publicKey: context.value.user.wallet?.address as string,
    passphrase: context.value.config.networks[0], // todo: fix network
  });

  useEffect(() => {
    setAddress(context.value.user.wallet?.address as string);
  }, [context.value.user.wallet?.address]);

  const handleDisconnect = () => {
    logout();
  };
  const handleCopyAddress = () => {
    copyText(context.value.user.wallet?.address as string)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      })
      .catch((error) => {
        console.error('Failed to copy code:', error);
      });
  };
  return (
    <div className="bluxcc-flex bluxcc-flex-col bluxcc-items-center bluxcc-justify-center">
      <div
        className="bluxcc-mt-4 bluxcc-size-[73px] bluxcc-rounded-full"
        style={{ background: appearance.accent }}
      />
      <p
        className="bluxcc-mb-4 bluxcc-mt-6 bluxcc-inline-flex bluxcc-cursor-pointer bluxcc-text-base bluxcc-text-gray-700"
        onClick={handleCopyAddress}
      >
        {copied ? (
          'Copied!'
        ) : (
          <span className="bluxcc-flex bluxcc-items-center bluxcc-gap-1">
            {address ? shortenAddress(address, 5) : ''}
            <Copy />
          </span>
        )}
      </p>
      <p className="bluxcc-text-center" style={{ color: appearance.accent }}>
        {account ? humanizeAmount(account.xlmBalance) : 'N/A'} XLM
      </p>

      <div className="bluxcc-mt-[16px] bluxcc-w-full bluxcc-space-y-2">
        <CardItem
          endArrow
          label="Send"
          startIcon={<Send fill={appearance.textColor} />}
          onClick={() => {
            context.setRoute(Routes.SEND);
          }}
        />
        <CardItem
          endArrow
          label="Activity"
          startIcon={<History fill={appearance.textColor} />}
          onClick={() => {
            context.setRoute(Routes.ACTIVITY);
          }}
        />
      </div>

      {/* divider */}
      <div className="bluxcc-flex bluxcc-h-8 bluxcc-w-full bluxcc-items-center bluxcc-justify-center">
        <div
          className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0"
          style={{
            background: appearance.borderColor,
            height: appearance.includeBorders ? appearance.borderWidth : '1px',
          }}
        />
      </div>

      <Button
        size="medium"
        variant="text"
        state="enabled"
        startIcon={<LogOut />}
        className="!bluxcc-text-gray-600"
        onClick={handleDisconnect}
      >
        Disconnect
      </Button>
    </div>
  );
};

export default Profile;
