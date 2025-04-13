import React from 'react';

import copyText from '../../../utils/copyText';
import shortenAddress from '../../../utils/shortenAddress';
import capitalizeFirstLetter from '../../../utils/capitalizeFirstLetter';

interface TransactionDetail {
  label: string;
  value: string;
  isHighlighted?: boolean;
  isCopyable?: boolean;
}

interface SummaryProps {
  operationsCount: number;
  sender: string;
  estimatedFee: string;
  action: string;
}

const Summary = ({
  operationsCount,
  sender,
  estimatedFee,
  action,
}: SummaryProps) => {
  const details: TransactionDetail[] = [
    { label: 'Action', value: capitalizeFirstLetter(action) },
    { label: 'Operations', value: operationsCount.toString() },
    {
      label: 'Sender',
      value: shortenAddress(sender, 5),
      isHighlighted: true,
      isCopyable: true,
    },
    { label: 'Estimated Fee', value: `${estimatedFee} XLM` },
  ];

  return (
    <div className="bluxcc-w-full bluxcc-text-sm bluxcc-text-gray-800">
      {details.map(({ label, value, isHighlighted, isCopyable }, index) => (
        <div
          key={index}
          className={`bluxcc-flex bluxcc-justify-between bluxcc-px-4 bluxcc-py-2 ${
            index < details.length - 1
              ? 'bluxcc-border-b bluxcc-border-dashed bluxcc-border-primary-100'
              : ''
          }`}
        >
          <span>{label}</span>
          <span
            className={`${isHighlighted ? 'bluxcc-text-primary-600' : 'bluxcc-text-gray-700'} ${
              isCopyable ? 'bluxcc-cursor-pointer' : ''
            }`}
            onClick={() => isCopyable && copyText(sender)}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Summary;
