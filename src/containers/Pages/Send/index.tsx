import React, { useState, useEffect, useRef } from 'react';

import Button from '../../../components/Button';
import InputField from '../../../components/Input';

import { ArrowDropUp } from '../../../assets/Icons';
import { StellarSmallLogo } from '../../../assets/logos';
import { useProvider } from '../../../context/provider';
import getContrastColor from '../../../utils/getContrastColor';

const Send = () => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
  const [openDropDown, setOpenDropDown] = useState(false);
  const [form, setForm] = useState({ amount: '', address: '', memo: '' });
  const [errors, setErrors] = useState<{ amount?: string; address?: string }>(
    {},
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  const handleSetAsset = () => {
    setOpenDropDown(!openDropDown);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        openDropDown
      ) {
        setOpenDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropDown]);

  return (
    <>
      {/* Main Form Content */}
      <div
        ref={containerRef}
        className={`bluxcc-relative ${openDropDown ? 'bluxcc-blur-sm' : ''}`}
      >
        {/* Amount Input */}
        <div className="bluxcc-relative bluxcc-mb-4">
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
                className="bluxcc-mr-2 bluxcc-inline-flex bluxcc-cursor-pointer"
              >
                Max <ArrowDropUp fill={appearance.accent} />
              </span>
            }
            onButtonClick={handleSetAsset}
            button={
              <span className="bluxcc-flex bluxcc-justify-between bluxcc-gap-1">
                <span className="bluxcc-flex bluxcc-items-center">
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
        <div>
          <InputField
            label="Memo"
            placeholder="Enter Memo (optional)"
            value={form.memo}
            onChange={handleChange('memo')}
          />
        </div>

        {/* divider */}
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
          size="large"
          variant="outline"
          state="enabled"
          onClick={handleSubmit}
        >
          Send
        </Button>

        {/* Overlay to prevent interaction with blurred content */}
        {openDropDown && (
          <div className="bluxcc-absolute bluxcc-inset-0 bluxcc-z-10" />
        )}
      </div>

      {/* Dropdown positioned above the blur */}
      {openDropDown && (
        <div
          ref={dropdownRef}
          className="bluxcc-absolute bluxcc-left-6 bluxcc-right-6 bluxcc-top-40 bluxcc-z-50 bluxcc-shadow-xl"
          style={{
            backgroundColor: appearance.background,
            borderRadius: appearance.cornerRadius,
            color: appearance.textColor,
            borderColor: appearance.borderColor,
            borderWidth: appearance.includeBorders
              ? appearance.borderWidth
              : '1px',
          }}
        >
          <div className="bluxcc-p-3">
            {[
              { name: 'Option 1', value: '1' },
              { name: 'Option 2', value: '2' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bluxcc-group bluxcc-flex bluxcc-h-10 bluxcc-w-full bluxcc-cursor-pointer bluxcc-items-center bluxcc-justify-start bluxcc-gap-2 bluxcc-space-y-2 bluxcc-px-2 bluxcc-py-1 bluxcc-text-xs"
                style={{
                  backgroundColor: appearance.bgField,
                  borderRadius: appearance.cornerRadius,
                  color: appearance.textColor,
                }}
                onClick={() => {
                  console.log('Selected:', item);
                  setOpenDropDown(false);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Send;
