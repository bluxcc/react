import React, { useState, useMemo } from 'react';

import CardItem from '../../../components/CardItem';
import handleLogos from '../../../utils/handleLogos';
import { useProvider } from '../../../context/provider';
import { Routes, WalletInterface } from '../../../types';
import getContrastColor from '../../../utils/getContrastColor';

import { StellarLogo } from '../../../assets/logos';
import { SmallEmailIcon } from '../../../assets/Icons';
import isBackgroundDark from '../../../utils/isBackgroundDark';

const OnBoarding = () => {
  const { value, setValue, setRoute } = useProvider();
  const [inputValue, setInputValue] = useState('');

  const wallets = value.availableWallets.sort(
    (a, b) => +b.isRecent - +a.isRecent,
  );

  const { appearance } = value.config;

  const loginMethods = value.config.loginMethods || [];

  const isPassKeyEnabled = loginMethods.includes('passkey');

  const orderedLoginMethods = useMemo(() => {
    const methods = [...loginMethods].filter((method) => method !== 'passkey');
    return [...methods, ...(isPassKeyEnabled ? ['passkey'] : [])];
  }, [loginMethods, isPassKeyEnabled]);

  const hiddenWallets = useMemo(() => {
    return wallets.length > 3 ? wallets.slice(2) : [];
  }, [wallets]);

  const visibleWallets = useMemo(() => {
    return wallets.length <= 3
      ? wallets
      : value.showAllWallets
        ? wallets.slice(2, wallets.length)
        : wallets.slice(0, 2);
  }, [wallets, value.showAllWallets]);

  const handleConnect = (wallet: WalletInterface) => {
    setValue((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        wallet: {
          address: null,
          passphrase: '',
          name: wallet.name,
        },
        waitingStatus: 'connecting',
      },
    }));

    setRoute(Routes.WAITING);
  };

  const handleConnectEmail = () => {
    setValue((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        email: inputValue,
      },
    }));

    setRoute(Routes.OTP);
  };

  const renderDivider = () => (
    <div className="bluxcc-my-1 bluxcc-flex bluxcc-h-8 bluxcc-w-full bluxcc-items-center bluxcc-justify-center">
      <div
        className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0 bluxcc-z-10"
        style={{
          borderTopWidth: appearance.includeBorders
            ? appearance.borderWidth
            : '1px',
          borderTopStyle: 'dashed',
          borderTopColor: appearance.borderColor,
        }}
      />

      <span
        className="bluxcc-z-20 bluxcc-w-auto bluxcc-select-none bluxcc-px-2 bluxcc-text-sm bluxcc-font-medium"
        style={{
          backgroundColor: appearance.background,
          color: appearance.borderColor,
        }}
      >
        or
      </span>
    </div>
  );

  return (
    <div className="bluxcc-w-full">
      {value.config.appearance.logo && (
        <div className="bluxcc-my-6 bluxcc-flex bluxcc-max-h-[80px] bluxcc-w-full bluxcc-items-center bluxcc-justify-center bluxcc-overflow-hidden">
          <img
            src={value.config.appearance.logo}
            alt={value.config.appName}
            width={152}
            height={60}
            className="bluxcc-max-h-[80px] bluxcc-max-w-[180px]"
            loading="eager"
            decoding="async"
            draggable="false"
            style={{ contentVisibility: 'auto' }}
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
              !value.showAllWallets &&
              method === 'wallet' &&
              nextMethod === 'email') ||
            (walletExists && method === 'email' && prevMethod !== 'wallet');

          if (method === 'wallet') {
            return (
              <React.Fragment key="wallet">
                {visibleWallets.map((checkedWallet) => (
                  <CardItem
                    key={checkedWallet.wallet.name}
                    {...checkedWallet}
                    label={checkedWallet.wallet.name}
                    isRecent={checkedWallet.isRecent}
                    startIcon={handleLogos(
                      checkedWallet.wallet.name,
                      isBackgroundDark(appearance.background),
                    )}
                    onClick={() => handleConnect(checkedWallet.wallet)}
                  />
                ))}

                {hiddenWallets.length > 0 && !value.showAllWallets && (
                  <CardItem
                    endArrow
                    label="All Stellar wallets"
                    isRecent={false}
                    startIcon={
                      <StellarLogo
                        fill={getContrastColor(appearance.bgField)}
                      />
                    }
                    onClick={() =>
                      setValue((prev) => ({ ...prev, showAllWallets: true }))
                    }
                  />
                )}

                {shouldRenderDivider && renderDivider()}
              </React.Fragment>
            );
          }
          if (!value.showAllWallets && method === 'email') {
            return (
              <React.Fragment key="email">
                {
                  <>
                    <CardItem
                      inputType="email"
                      variant="input"
                      isRecent={false}
                      startIcon={<SmallEmailIcon fill={appearance.textColor} />}
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

          if (!value.showAllWallets && method === 'passkey') {
            return (
              <div
                key="passkey"
                className="!bluxcc-mt-6 bluxcc-flex bluxcc-h-5 bluxcc-cursor-pointer bluxcc-items-center bluxcc-justify-center bluxcc-text-sm bluxcc-font-medium bluxcc-leading-[28px]"
                style={{ color: appearance.accent }}
              >
                Log in with Passkey
              </div>
            );
          }

          return null;
        })}
      </div>

      <footer
        className={`bluxcc-w-full bluxcc-cursor-pointer bluxcc-pt-[15px] bluxcc-text-center bluxcc-text-xs bluxcc-font-medium`}
        style={{
          color: appearance.textColor,
        }}
      >
        <a
          aria-label="blux website"
          href="https://blux.cc"
          target="_blank"
          rel="noreferrer"
        >
          Powered by Blux.cc
        </a>
      </footer>
    </div>
  );
};

export default OnBoarding;
