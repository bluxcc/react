import React, { useState } from 'react';

import Button from '../../../components/Button';
import InputField from '../../../components/Input';

import { IAsset } from '../../../types';
import SelectAssets from '../SelectAsset';
import { ArrowDropUp } from '../../../assets/Icons';
import { useProvider } from '../../../context/provider';
import { StellarSmallLogo } from '../../../assets/logos';
import getContrastColor from '../../../utils/getContrastColor';

const Send = () => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const [showSelectAssetPage, setShowSelectAssetPage] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<null | IAsset>(null);
  const [form, setForm] = useState({ amount: '', address: '', memo: '' });
  const [errors, setErrors] = useState<{ amount?: string; address?: string }>(
    {},
  );

  let assets: IAsset[] = [];

  if (context.value.account.account) {
    assets = context.value.account.account.balances
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
  }

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  const handleOpenAssets = () => {
    setShowSelectAssetPage(true);
  };

  const handleMaxClick = () =>
    setForm((prev) => ({ ...prev, amount: '345.00' }));

  const handlePasteClick = async () => {
    const text = await navigator.clipboard.readText();
    setForm((prev) => ({ ...prev, address: text }));
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!form.address) newErrors.address = 'Address is required';
    if (!form.amount) newErrors.amount = 'Amount is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Submit logic here
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
      {/* Main Form Content */}
      <div>
        {/* Amount Input */}
        <div className="bluxcc:relative bluxcc:mb-4">
          <InputField
            autoFocus
            type="number"
            label="Amount"
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
                Max <ArrowDropUp fill={appearance.accent} />
              </span>
            }
            onButtonClick={handleOpenAssets}
            button={
              <span className="bluxcc:flex bluxcc:justify-between bluxcc:gap-1">
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

        {/* Recipient Address Input */}
        <div className="bluxcc:mb-4">
          <InputField
            label="To"
            placeholder="Enter address"
            value={form.address}
            onChange={handleChange('address')}
            error={errors.address}
            button="Paste"
            onButtonClick={handlePasteClick}
          />
        </div>

        {/* Memo Input */}
        <div>
          <InputField
            label="Memo"
            placeholder="Enter Memo (optional)"
            value={form.memo}
            onChange={handleChange('memo')}
          />
        </div>

        {/* divider */}
        <div className="bluxcc:flex bluxcc:h-8 bluxcc:w-full bluxcc:items-center bluxcc:justify-center">
          <div
            className="bluxcc:absolute bluxcc:left-0 bluxcc:right-0"
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
          Send
        </Button>
      </div>
    </>
  );
};

export default Send;
