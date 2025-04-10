import React from 'react';

import { useProvider } from '../../../context/provider';
import { Downstream, Globe, MultiOperation, RedAlert, Upstream } from '../../../assets/Icons';
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
    const explorerUrl = getExplorerUrl(context.value.config.networks[0], `tx/${hash}`); // todo: network fix
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-start gap-3">
        <div
          className={`size-8 flex items-center justify-center rounded-full`}
          style={{
            backgroundColor: context.value.config.appearance.background,
          }}
        >
          {status !== 'success' ? <RedAlert /> : handleActionLogo(action)}
        </div>
        <div className="flex flex-col justify-start">
          <p className="text-xs text-gray-700 text-start font-medium">{action}</p>
          <p className="text-sm font-medium">{amount} XLM</p>
        </div>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-2">
        {date}
        <div
          className="flex justify-center item-center rounded-full size-8 cursor-pointer bg-gray-50"
          style={{
            backgroundColor: context.value.config.appearance.background,
          }}
          title="View transaction details"
          onClick={handleGoToExplorer}
        >
          <span className="flex justify-center items-center">
            <Globe />
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(History);
