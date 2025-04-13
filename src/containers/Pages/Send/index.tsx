import React, { useState } from 'react';

import Button from '../../../components/Button';
import InputField from '../../../components/Input';

import { ArrowDropUp } from '../../../assets/Icons';
import { StellarSmallLogo } from '../../../assets/logos';
import { useProvider } from '../../../context/provider';
import getContrastColor from '../../../utils/getContrastColor';

const Send = () => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const [form, setForm] = useState({ amount: '', address: '', memo: '' });
  const [errors, setErrors] = useState<{ amount?: string; address?: string }>(
    {},
  );

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
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
      // console.log('Submitting transaction:', form);
    }
  };

  return (
    <div>
      {/* Amount Input */}
      <div className="bluxcc-mb-4">
        <InputField
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
              className="bluxcc-mr-2 bluxcc-inline-flex bluxcc-cursor-pointer"
            >
              Max <ArrowDropUp fill={appearance.accent} />
            </span>
          }
          button={
            <span
              className="bluxcc-flex bluxcc-justify-between bluxcc-gap-1 bluxcc-border-primary-100"
              style={{ color: appearance.textColor }}
            >
              <span className="flex items-center">
                <StellarSmallLogo
                  fill={getContrastColor(appearance.background)}
                />
              </span>
              XLM
            </span>
          }
        />
      </div>

      {/* Recipient Address Input */}
      <div className="bluxcc-mb-4">
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
      <div className="bluxcc-mb-4">
        <InputField
          label="Memo"
          placeholder="Enter Memo (optional)"
          value={form.memo}
          onChange={handleChange('memo')}
        />
      </div>

      {/* Divider */}
      <div className="bluxcc-my-4 bluxcc-mb-8 bluxcc-w-full">
        <div className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0 bluxcc-h-[0.5px] bluxcc-bg-primary-100" />
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
  );
};

export default Send;
