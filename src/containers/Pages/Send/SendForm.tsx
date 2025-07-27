import React, { useState } from 'react';

import { IAsset } from '../../../types';
import SelectAssets from '../SelectAsset';
import Button from '../../../components/Button';
import { useBlux } from '../../../hooks/useBlux';
import InputField from '../../../components/Input';
import { ArrowDropUp } from '../../../assets/Icons';
import { useProvider } from '../../../context/provider';
import { StellarSmallLogo } from '../../../assets/logos';
import getContrastColor from '../../../utils/getContrastColor';
import paymentTransaction from '../../../utils/stellar/paymentTransaction';
import { StrKey } from '@stellar/stellar-sdk';
import { useLang } from '../../../hooks/useLang';

type SendFormValues = {
  memo: string;
  amount: string;
  address: string;
};

const SendForm = () => {
  const t = useLang();
  const { value, setValue } = useProvider();
  const { sendTransaction } = useBlux();
  const [errors, setErrors] = useState<Partial<SendFormValues>>({});
  const [showSelectAssetPage, setShowSelectAssetPage] = useState(false);
  const [form, setForm] = useState<SendFormValues>({
    memo: '',
    amount: '',
    address: '',
  });

  const { appearance } = value.config;
  const balances = value.account.account?.balances || [];

  const assets: IAsset[] = balances
    .filter((x) => x.asset_type !== 'liquidity_pool_shares')
    .filter((x) => x.balance !== '0.0000000')
    .map((asset) => {
      if (asset.asset_type === 'native') {
        return {
          assetIssuer: '',
          assetCode: 'XLM',
          balance: asset.balance,
          assetType: asset.asset_type,
        };
      } else {
        return {
          balance: asset.balance,
          assetCode: asset.asset_code,
          assetType: asset.asset_type,
          assetIssuer: asset.asset_issuer,
        };
      }
    });

  const [selectedAsset, setSelectedAsset] = useState<IAsset>(assets[0]);

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  const handleOpenAssets = () => {
    setShowSelectAssetPage(true);
  };

  const handleMaxClick = () => {
    if (!selectedAsset) {
      return;
    }

    const balance = Number(selectedAsset.balance).toString();

    setForm((prev) => ({ ...prev, amount: balance }));
  };

  const handlePasteClick = async () => {
    const text = await navigator.clipboard.readText();

    setForm((prev) => ({ ...prev, address: text }));
  };

  const handleSubmit = async () => {
    const errorMessages: typeof errors = {};

    if (!form.amount) {
      errorMessages.amount = t('amountRequired');
    } else if (Number(form.amount) > Number(selectedAsset.balance)) {
      errorMessages.amount = t('amountExceedsBalance');
    }

    if (!form.address) {
      errorMessages.address = t('addressRequired');
    } else if (!StrKey.isValidEd25519PublicKey(form.address)) {
      errorMessages.address = t('addressInvalid');
    }

    setErrors(errorMessages);

    if (Object.keys(errorMessages).length === 0) {
      try {
        const xdr = await paymentTransaction(
          form.memo,
          form.amount,
          form.address,
          selectedAsset,
          value.user.wallet?.address as string,
          value.servers.horizon,
          value.activeNetwork,
        );

        setValue((prev) => ({
          ...prev,
          isModalOpen: false,
        }));

        setTimeout(() => {
          sendTransaction(xdr);
        }, 250);
      } catch (e: any) {
        errorMessages.address = e.message;

        setErrors(errorMessages);
      }
    }
  };

  if (showSelectAssetPage) {
    return (
      <SelectAssets
        assets={assets}
        setSelectedAsset={setSelectedAsset}
        setShowSelectAssetPage={setShowSelectAssetPage}
      />
    );
  }

  return (
    <>
      <div>
        <div className="bluxcc:relative bluxcc:mb-4">
          <InputField
            autoFocus
            type="number"
            label={t('amount')}
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange('amount')}
            error={errors.amount}
            customLabel={
              <span
                onClick={handleMaxClick}
                style={{ color: appearance.accent }}
                className="bluxcc:mr-2 bluxcc:inline-flex bluxcc:cursor-pointer"
              >
                {t('max')} <ArrowDropUp fill={appearance.accent} />
              </span>
            }
            onButtonClick={handleOpenAssets}
            button={
              <span className="bluxcc:flex bluxcc:justify-between bluxcc:!gap-1">
                <span className="bluxcc:flex bluxcc:items-center">
                  <StellarSmallLogo
                    fill={getContrastColor(appearance.background)}
                  />
                </span>
                {selectedAsset ? selectedAsset.assetCode : 'XLM'}
              </span>
            }
          />
        </div>

        <div className="bluxcc:mb-4">
          <InputField
            label={t('to')}
            placeholder={t('enterAddress')}
            value={form.address}
            onChange={handleChange('address')}
            error={errors.address}
            button={t('paste')}
            onButtonClick={handlePasteClick}
          />
        </div>

        <div>
          <InputField
            label={t('memo')}
            placeholder={t('enterMemo')}
            value={form.memo}
            onChange={handleChange('memo')}
          />
        </div>

        {/* divider */}
        <div className="bluxcc:flex bluxcc:h-8 bluxcc:w-full bluxcc:items-center bluxcc:justify-center">
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

        <Button
          size="large"
          variant="outline"
          state="enabled"
          onClick={handleSubmit}
        >
          {t('sendButton')}
        </Button>
      </div>
    </>
  );
};

export default SendForm;
