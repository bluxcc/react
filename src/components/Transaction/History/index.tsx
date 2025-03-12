import React from 'react';

import { useProvider } from '../../../context/provider';
import { Globe, RedAlert, Upstream } from '../../../assets/Icons';
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

  const handleGoToExplorer = () => {
    const explorerUrl = getExplorerUrl(context.value.config.network, `tx/${hash}`);
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {status === 'success' ? <Upstream /> : <RedAlert />}
        </div>
        <div>
          <p className="text-xs text-gray-700 font-medium">{action}</p>
          <p className="text-sm font-medium">{amount} XLM</p>
        </div>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-2">
        {date}
        <div
          className="flex justify-center item-center rounded-full size-8 cursor-pointer bg-gray-50"
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
