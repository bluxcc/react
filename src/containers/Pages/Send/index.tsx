import React, { useState } from 'react';

import Button from '../../../components/Button';
import InputField from '../../../components/Input';

import { ArrowDropUp } from '../../../assets/Icons';
import { StellarSmallLogo } from '../../../assets/logos';

const Send = () => {
  const [form, setForm] = useState({ amount: '', address: '', memo: '' });
  const [errors, setErrors] = useState<{ amount?: string; address?: string }>({});

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleMaxClick = () => setForm((prev) => ({ ...prev, amount: '345.00' }));

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
      console.log('Submitting transaction:', form);
    }
  };

  return (
    <div>
      {/* Amount Input */}
      <div className="mb-4">
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
              className="inline-flex text-primary-500 cursor-pointer mr-2"
            >
              Max <ArrowDropUp />
            </span>
          }
          button={
            <span className="flex justify-between gap-1 text-black">
              <span className="flex items-center">
                <StellarSmallLogo fill="black" />
              </span>
              XLM
            </span>
          }
        />
      </div>

      {/* Recipient Address Input */}
      <div className="mb-4">
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
      <div className="mb-4">
        <InputField
          label="Memo"
          placeholder="Enter Memo (optional)"
          value={form.memo}
          onChange={handleChange('memo')}
        />
      </div>

      {/* Divider */}
      <div className="w-full my-4 mb-8">
        <div className="absolute left-0 right-0 bg-primary-100 h-[0.5px]" />
      </div>

      <Button size="large" variant="outline" state="enabled" onClick={handleSubmit}>
        Send
      </Button>
    </div>
  );
};

export default Send;
