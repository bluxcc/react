import React, { useState } from 'react';
import Button from '../../../components/Button';
import InputField from '../../../components/Input';
import { ArrowDropUp } from '../../../assets/Icons';
import { StellarSmallIcon } from '../../../assets/logos';

const Send = () => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  const handleMaxClick = () => {
    setAmount('345.00'); // Simulating max balance selection
  };

  const handlePasteClick = () => {
    navigator.clipboard.readText().then((text) => setAddress(text));
  };

  const handleSubmit = () => {};

  return (
    <div>
      {/* Amount Input */}
      <div className="mb-4">
        <InputField
          label="Amount"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          customLabel={
            <span onClick={handleMaxClick} className="inline-flex text-primary-500 mr-2">
              Max
              <ArrowDropUp />
            </span>
          }
          button={
            <span className="flex justify-between gap-1 text-black">
              <span className="flex justify-center items-center">
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
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          button="Paste"
          onButtonClick={handlePasteClick}
        />
      </div>

      {/* divider */}
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
