import React from 'react';

import { useProvider } from '../../../context/provider';
import getExplorerUrl from '../../../utils/stellar/getExplorerUrl';
import {
  Globe,
  RedAlert,
  Upstream,
  Downstream,
  MultiOperation,
} from '../../../assets/Icons';

export type TxDetail = {
  hash: string;
  date: string;
  title: string;
  description: string;
}

interface TransactionProps {
  tx: TxDetail;
}

const History = ({ tx }: TransactionProps) => {
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
      `tx/${tx.hash}`,
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
          {handleActionLogo(tx.title)}
        </div>
        <div className="bluxcc-flex bluxcc-flex-col bluxcc-justify-start">
          <p className="bluxcc-text-start bluxcc-text-xs bluxcc-font-medium bluxcc-text-gray-700">
            {tx.title}
          </p>
          <p className="bluxcc-text-sm bluxcc-font-medium">{tx.description}</p>
        </div>
      </div>
      <div className="bluxcc-flex bluxcc-items-center bluxcc-gap-2 bluxcc-text-xs bluxcc-text-gray-500">
        {tx.date}
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
