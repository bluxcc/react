import React from 'react';

import copyText from '../../../utils/copyText';
import { useProvider } from '../../../context/provider';
import shortenAddress from '../../../utils/shortenAddress';
import NETWORKS_DETAILS from '../../../constants/networkDetails';
import capitalizeFirstLetter from '../../../utils/capitalizeFirstLetter';

interface TransactionDetail {
  label: string;
  value: string;
  isHighlighted?: boolean;
  isCopyable?: boolean;
  copyValue?: string;
}

interface SummaryProps {
  operationsCount: number;
  sender: string;
  receiver?: string | null;
  estimatedFee: string;
  action: string;
  network: string;
}

const Summary = ({
  operationsCount,
  sender,
  receiver,
  network,
  estimatedFee,
  action,
}: SummaryProps) => {
  const context = useProvider();
  const appearance = context.value.config.appearance;

  const details: TransactionDetail[] = [
    { label: 'Action', value: capitalizeFirstLetter(action) },
    { label: 'Operations', value: operationsCount.toString() },
    {
      label: 'Sender',
      value: shortenAddress(sender, 5),
      isHighlighted: true,
      isCopyable: true,
      copyValue: sender,
    },
    { label: 'Network', value: NETWORKS_DETAILS[network].name },
    { label: 'Estimated Fee', value: `${estimatedFee} XLM` },
  ];

  if (receiver) {
    details.splice(3, 0, {
      label: 'To',
      value: shortenAddress(receiver, 5),
      isHighlighted: true,
      isCopyable: true,
      copyValue: receiver,
    });
  }

  return (
    <div className="bluxcc-w-full bluxcc-text-sm bluxcc-text-gray-800">
      {details.map(
        ({ label, value, isHighlighted, isCopyable, copyValue }, index) => (
          <div
            key={index}
            className="bluxcc-flex bluxcc-justify-between bluxcc-px-4 bluxcc-py-2"
            style={
              index === details.length - 1
                ? {}
                : {
                    borderBottomColor: appearance.borderColor,
                    borderBottomStyle: 'dashed',
                    borderBottomWidth: appearance.includeBorders
                      ? appearance.borderWidth
                      : '1px',
                  }
            }
          >
            <span style={{ color: appearance.textColor }}>{label}</span>
            <span
              className={`${isCopyable ? 'bluxcc-cursor-pointer' : ''}`}
              style={{
                color: isHighlighted ? appearance.accent : appearance.textColor,
              }}
              onClick={() => isCopyable && copyValue && copyText(copyValue)}
            >
              {value}
            </span>
          </div>
        ),
      )}
    </div>
  );
};

export default Summary;
