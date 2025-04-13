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
    <div className="bluxcc-my-1 bluxcc-flex bluxcc-h-8 bluxcc-w-full bluxcc-items-center bluxcc-justify-center">
      <div className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0 bluxcc-z-10 bluxcc-border-spacing-2 bluxcc-border-t bluxcc-border-dashed bluxcc-border-primary-100" />
      <span
        className="bluxcc-z-20 bluxcc-w-auto bluxcc-select-none bluxcc-px-2 bluxcc-text-sm bluxcc-font-medium bluxcc-text-primary-100"
        style={{ backgroundColor: appearance.background }}
      >
        or
      </span>
    </div>
  );

  return (
    <div className="bluxcc-w-full">
      {context.value.config.appearance.logo && (
        <div className="bluxcc-my-6 bluxcc-flex bluxcc-max-h-[80px] bluxcc-w-full bluxcc-items-center bluxcc-justify-center bluxcc-overflow-hidden">
          <img
            src={context.value.config.appearance.logo}
            alt={context.value.config.appName}
            width={152}
            height={60}
            className="bluxcc-max-h-[80px] bluxcc-max-w-[180px]"
          />
        </div>
      )}

      <div className="bluxcc-space-y-2">
        {orderedLoginMethods.map((method, index) => {
          const nextMethod = orderedLoginMethods[index + 1];
          const prevMethod = orderedLoginMethods[index - 1];
          const walletExists = orderedLoginMethods.includes('wallet');
          const shouldRenderDivider =
            (walletExists &&
              !showAllWallets &&
              method === 'wallet' &&
              nextMethod === 'email') ||
            (walletExists && method === 'email' && prevMethod !== 'wallet');

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
                    startIcon={
                      <StellarLogo
                        fill={getContrastColor(appearance.background)}
                      />
                    }
                    onClick={() => setShowAllWallets(true)}
                  />
                )}

                {shouldRenderDivider && renderDivider()}
              </React.Fragment>
            );
          }
          if (!showAllWallets && method === 'email') {
            return (
              <React.Fragment key="email">
                {
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
                }
              </React.Fragment>
            );
          }

          if (!showAllWallets && method === 'passkey') {
            return (
              <div
                key="passkey"
                className="bluxcc-mt-4 bluxcc-flex bluxcc-h-6 bluxcc-cursor-pointer bluxcc-items-center bluxcc-justify-center bluxcc-text-sm bluxcc-font-medium bluxcc-leading-[28px]"
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
        className={`bluxcc-w-full bluxcc-pt-[8px] bluxcc-text-center bluxcc-text-[12px] bluxcc-font-medium`}
        style={{
          color: appearance.textColor,
        }}
      >
        Powered by{' '}
        <a
          aria-label="blux link"
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
