import React, { useState } from 'react';

import { Routes } from '../../../types';
import copyText from '../../../utils/copyText';
import Button from '../../../components/Button';
import { useBlux } from '../../../hooks/useBlux';
import { useBalance } from '../../../useStellar';
import CardItem from '../../../components/CardItem';
import { useProvider } from '../../../context/provider';
import shortenAddress from '../../../utils/shortenAddress';
import humanizeAmount from '../../../utils/humanizeAmount';
import { Copy, History, LogOut, Send } from '../../../assets/Icons';

const Profile = () => {
  const { logout } = useBlux();
  const context = useProvider();
  const [copied, setCopied] = useState(false);
  const { balance } = useBalance({ asset: 'native' });

  const address = context.value.user.wallet?.address as string;
  const appearance = context.value.config.appearance;

  const handleLogout = () => {
    logout();
  };

  const handleCopyAddress = () => {
    copyText(address)
      .then(() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1000);
      })
      .catch(() => {});
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
        {balance ? humanizeAmount(balance) : 'N/A'} XLM
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

      <div className="bluxcc-flex bluxcc-h-8 bluxcc-w-full bluxcc-items-center bluxcc-justify-center">
        <div
          className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0"
          style={{
            borderTopWidth: appearance.includeBorders
              ? appearance.borderWidth
              : '1px',
            borderTopColor: appearance.borderColor,
          }}
        />
      </div>

      <Button
        size="medium"
        variant="text"
        state="enabled"
        startIcon={<LogOut />}
        className="!bluxcc-text-gray-600"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default Profile;
