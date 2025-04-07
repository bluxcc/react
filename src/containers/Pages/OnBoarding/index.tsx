import React, { useState, useMemo } from 'react';

import CardItem from '../../../components/CardItem';
import handleLogos from '../../../utils/handleLogos';
import { useProvider } from '../../../context/provider';
import { Routes, WalletInterface } from '../../../types';
import getContrastColor from '../../../utils/getContrastColor';

import { StellarLogo } from '../../../assets/logos';
import { SmallEmailIcon } from '../../../assets/Icons';

type OnBoardingProps = {
  showAllWallets: boolean;
  setShowAllWallets: (value: boolean) => void;
};

const OnBoarding = ({ showAllWallets, setShowAllWallets }: OnBoardingProps) => {
  const context = useProvider();
  const [inputValue, setInputValue] = useState('');

  const wallets = context.value.availableWallets;

  const hiddenWallets = useMemo(() => {
    return wallets.length > 3 ? wallets.slice(2) : [];
  }, [wallets]);

  const visibleWallets = useMemo(() => {
    return wallets.length <= 3
      ? wallets
      : showAllWallets
      ? wallets.slice(2, wallets.length)
      : wallets.slice(0, 2);
  }, [wallets, showAllWallets]);

  const handleConnect = (wallet: WalletInterface) => {
    context.setValue((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        wallet: {
          address: null,
          passphrase: '',
          name: wallet.name,
        },
      },
    }));

    context.setRoute(Routes.WAITING);
  };

  const handleConnectEmail = () => {
    context.setValue((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        email: inputValue,
      },
    }));

    context.setRoute(Routes.OTP);
  };

  const { appearance } = context.value.config;

  const loginMethods = context.value.config.loginMethods || [];

  const isPassKeyEnabled = loginMethods.includes('passkey');

  const orderedLoginMethods = useMemo(() => {
    const methods = [...loginMethods].filter((method) => method !== 'passkey');
    return [...methods, ...(isPassKeyEnabled ? ['passkey'] : [])];
  }, [loginMethods, isPassKeyEnabled]);

  const renderDivider = () => (
    <div className="w-full flex items-center justify-center h-8 my-1">
      <div className="absolute z-10 left-0 right-0 border-t border-dashed border-spacing-3 border-primary-100" />
      <span
        className="z-20 w-auto px-2 text-primary-100 text-sm font-medium"
        style={{ backgroundColor: appearance.background }}
      >
        or
      </span>
    </div>
  );

  return (
    <div className="w-full">
      {context.value.config.appearance.logo && (
        <div className="flex justify-center items-center my-6 w-full max-h-[80px] overflow-hidden">
          <img
            src={context.value.config.appearance.logo}
            alt={context.value.config.appName}
            width={152}
          />
        </div>
      )}

      <div className="space-y-2">
        {orderedLoginMethods.map((method, index) => {
          const nextMethod = orderedLoginMethods[index + 1];
          const prevMethod = orderedLoginMethods[index - 1];
          const shouldRenderDivider =
            (!showAllWallets && method === 'wallet' && nextMethod === 'email') ||
            (method === 'email' && prevMethod !== 'wallet');

          if (method === 'wallet') {
            return (
              <React.Fragment key="wallet">
                {visibleWallets.map((wallet) => (
                  <CardItem
                    key={wallet.name}
                    {...wallet}
                    label={wallet.name}
                    startIcon={handleLogos(wallet.name)}
                    onClick={() => handleConnect(wallet)}
                  />
                ))}

                {hiddenWallets.length > 0 && !showAllWallets && (
                  <CardItem
                    endArrow
                    label="All Stellar wallets"
                    startIcon={<StellarLogo fill={getContrastColor(appearance.background)} />}
                    onClick={() => setShowAllWallets(true)}
                  />
                )}

                {shouldRenderDivider && renderDivider()}
              </React.Fragment>
            );
          }
          if (method === 'email') {
            return (
              <React.Fragment key="email">
                {!showAllWallets && (
                  <>
                    <CardItem
                      inputType="email"
                      variant="input"
                      startIcon={<SmallEmailIcon fill={appearance.accent} />}
                      onChange={(value) => setInputValue(value)}
                      onEnter={handleConnectEmail}
                      onSubmit={handleConnectEmail}
                    />

                    {shouldRenderDivider && renderDivider()}
                  </>
                )}
              </React.Fragment>
            );
          }

          if (method === 'passkey') {
            return (
              <div
                key="passkey"
                className="flex justify-center items-center font-medium text-sm h-11 leading-[32px] cursor-pointer"
                style={{ color: appearance.accent }}
              >
                Log in with Passkey
              </div>
            );
          }

          return null;
        })}
      </div>

      <div
        className="font-semibold text-[12px] text-center w-full pt-[6px]"
        style={{
          color: appearance.textColor,
        }}
      >
        Powered by{' '}
        <a
          href="https://blux.cc"
          target="_blank"
          rel="noreferrer"
          style={{ color: appearance.accent }}
        >
          Blux.cc
        </a>
      </div>
    </div>
  );
};

export default OnBoarding;
