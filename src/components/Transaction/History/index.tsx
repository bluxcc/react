import React from 'react';

import { useProvider } from '../../../context/provider';
import {
  Downstream,
  Globe,
  MultiOperation,
  RedAlert,
  Upstream,
} from '../../../assets/Icons';
import getExplorerUrl from '../../../utils/stellar/getExplorerUrl';

interface TransactionProps {
  amount: string;
  date: string;
  status: 'success' | 'failed' | string;
  action: string;
  hash: string;
}

const History = ({ amount, date, status, action, hash }: TransactionProps) => {
  const context = useProvider();

  const handleActionLogo = (action: string) => {
    switch (action) {
      case 'Receive':
        return <Downstream />;
      case 'Send':
        return <Upstream />;
      default:
        return <MultiOperation />;
    }
  };

  const handleGoToExplorer = () => {
    const explorerUrl = getExplorerUrl(
      context.value.config.networks[0],
      `tx/${hash}`,
    ); // todo: network fix
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bluxcc-flex bluxcc-items-center bluxcc-justify-between">
      <div className="bluxcc-flex bluxcc-items-center bluxcc-justify-start bluxcc-gap-3">
        <div
          className={`bluxcc-flex bluxcc-size-8 bluxcc-items-center bluxcc-justify-center bluxcc-rounded-full`}
          style={{
            backgroundColor: context.value.config.appearance.background,
          }}
        >
          {status !== 'success' ? <RedAlert /> : handleActionLogo(action)}
        </div>
        <div className="bluxcc-flex bluxcc-flex-col bluxcc-justify-start">
          <p className="bluxcc-text-start bluxcc-text-xs bluxcc-font-medium bluxcc-text-gray-700">
            {action}
          </p>
          <p className="bluxcc-text-sm bluxcc-font-medium">{amount} XLM</p>
        </div>
      </div>
      <div className="bluxcc-flex bluxcc-items-center bluxcc-gap-2 bluxcc-text-xs bluxcc-text-gray-500">
        {date}
        <div
          className="bluxcc-item-center bluxcc-flex bluxcc-size-8 bluxcc-cursor-pointer bluxcc-justify-center bluxcc-rounded-full bluxcc-bg-gray-50"
          style={{
            backgroundColor: context.value.config.appearance.background,
          }}
          title="View transaction details"
          onClick={handleGoToExplorer}
        >
          <span className="bluxcc-flex bluxcc-items-center bluxcc-justify-center">
            <Globe />
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(History);
