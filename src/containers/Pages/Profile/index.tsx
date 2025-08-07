import React, { useState } from 'react';

import { Routes } from '../../../types';
import copyText from '../../../utils/copyText';
import { useLang } from '../../../hooks/useLang';
// import { useBlux } from '../../../hooks/useBlux';
import CardItem from '../../../components/CardItem';
import { useProvider } from '../../../context/provider';
import shortenAddress from '../../../utils/shortenAddress';
import humanizeAmount from '../../../utils/humanizeAmount';
import {
  BalancesIcon,
  Copy,
  History,
  // LogOut,
  ReceiveIcon,
  Send,
  SwapIcon,
} from '../../../assets/Icons';
import hexToRgba from '../../../utils/hexToRgba';

const Profile = () => {
  // const { logout } = useBlux();
  const t = useLang();
  const context = useProvider();
  const [copied, setCopied] = useState(false);

  const appearance = context.value.config.appearance;
  const address = context.value.user.wallet?.address as string;

  // const handleLogout = () => {
  //   logout();
  // };

  const handleCopyAddress = () => {
    copyText(address)
      .then(() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(() => {});
  };

  const balance = context.value.account.account
    ? context.value.account.account.balances.find(
        (b) => b.asset_type === 'native',
      )?.balance
    : '0';

  return (
    <div className="bluxcc:flex bluxcc:flex-col bluxcc:items-center bluxcc:justify-center">
      <div className="bluxcc:mt-4 bluxcc:mb-6 bluxcc:flex bluxcc:flex-col bluxcc:items-center bluxcc:justify-center">
        <div
          className="bluxcc:size-[64px] bluxcc:rounded-full"
          style={{ background: appearance.accent }}
        />
        <p
          className="bluxcc:mt-2 bluxcc:text-center bluxcc:text-2xl"
          style={{ color: appearance.accent }}
        >
          {balance ? `${humanizeAmount(balance)} XLM` : t('loading')}
        </p>
        <p
          className="bluxcc:!mt-4 bluxcc:inline-flex bluxcc:cursor-pointer bluxcc:text-sm"
          onClick={handleCopyAddress}
          style={{ color: hexToRgba(appearance.textColor, 0.7) }}
        >
          {copied ? (
            t('copied')
          ) : (
            <span className="bluxcc:flex bluxcc:items-center bluxcc:gap-1">
              {address ? shortenAddress(address, 5) : ''}
              <Copy fill={hexToRgba(appearance.textColor, 0.7)} />
            </span>
          )}
        </p>
      </div>

      <div className="bluxcc:flex bluxcc:space-x-3">
        <CardItem
          size="small"
          label={t('send')}
          startIcon={<Send fill={appearance.textColor} />}
          onClick={() => {
            context.setRoute(Routes.SEND);
          }}
        />
        <CardItem
          size="small"
          label={t('receive')}
          startIcon={<ReceiveIcon fill={appearance.textColor} />}
          onClick={() => {
            context.setRoute(Routes.RECEIVE);
          }}
        />
        <CardItem
          size="small"
          label={t('swap')}
          startIcon={<SwapIcon fill={appearance.textColor} />}
          onClick={() => {
            context.setRoute(Routes.SWAP);
          }}
        />
      </div>
      <div className="bluxcc:mt-[16px] bluxcc:mb-2 bluxcc:w-full bluxcc:space-y-2">
        <CardItem
          endArrow
          label={t('balances')}
          startIcon={<BalancesIcon fill={appearance.textColor} />}
          onClick={() => {
            context.setRoute(Routes.BALANCES);
          }}
        />

        <CardItem
          endArrow
          label={t('activity')}
          startIcon={<History fill={appearance.textColor} />}
          onClick={() => {
            context.setRoute(Routes.ACTIVITY);
          }}
        />
      </div>

      {/* <div className="bluxcc:flex bluxcc:h-8 bluxcc:w-full bluxcc:items-center bluxcc:justify-center">
        <div
          className="bluxcc:absolute bluxcc:right-0 bluxcc:left-0"
          style={{
            borderTopWidth: appearance.includeBorders
              ? appearance.borderWidth
              : '1px',
            borderTopColor: appearance.borderColor,
          }}
        />
      </div>

      <div
        style={{ color: appearance.textColor }}
        onClick={handleLogout}
        className="bluxcc:flex bluxcc:h-12 bluxcc:w-full bluxcc:cursor-pointer bluxcc:items-center bluxcc:justify-center bluxcc:gap-2"
      >
        <LogOut fill={appearance.textColor} />
        {t('logout')}
      </div> */}
    </div>
  );
};

export default Profile;
