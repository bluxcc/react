import React from 'react';

import copyText from '../../utils/copyText';
import shortenAddress from '../../utils/shortenAddress';

interface TransactionDetail {
  label: string;
  value: string;
  isHighlighted?: boolean;
  isCopyable?: boolean;
}

interface TransactionSummaryProps {
  operations: number;
  sender: string;
  receiver: string;
  estimatedFee: string;
  action: string;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  operations,
  sender,
  receiver,
  estimatedFee,
  action,
}) => {
  const details: TransactionDetail[] = [
    { label: action, value: action },
    { label: 'Operations', value: operations.toString() },
    { label: 'Sender', value: shortenAddress(sender, 5), isHighlighted: true, isCopyable: true },
    { label: 'To', value: shortenAddress(receiver, 5), isHighlighted: true, isCopyable: true },
    { label: 'Estimated Fee', value: `${estimatedFee} XLM` },
  ];

  return (
    <div className="text-sm text-gray-800 w-full">
      {details.map(({ label, value, isHighlighted, isCopyable }, index) => (
        <div
          key={index}
          className={`flex justify-between py-2 px-4 ${
            index < details.length - 1 ? 'border-b border-dashed border-gray-300' : ''
          }`}
        >
          <span>{label}</span>
          <span
            className={`${isHighlighted ? 'text-primary-600' : 'text-gray-700'} ${
              isCopyable ? 'cursor-pointer' : ''
            }`}
            onClick={() => isCopyable && copyText(label === 'Sender' ? sender : receiver)}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TransactionSummary;
