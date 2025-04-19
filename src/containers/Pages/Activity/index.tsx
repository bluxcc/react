import { Horizon } from '@stellar/stellar-sdk';
import React, { useEffect, useState } from 'react';

import Button from '../../../components/Button';
import { useTransactions } from '../../../useStellar';
import { useProvider } from '../../../context/provider';
import toTitleFormat from '../../../utils/toTitleFormat';
import getExplorerUrl from '../../../utils/stellar/getExplorerUrl';
import History, { TxDetail } from '../../../components/Transaction/History';
import humanizeAmount from '../../../utils/humanizeAmount';

const handleAssetText = (
  op: Horizon.ServerApi.PaymentOperationRecord | any,
) => {
  if (op.asset_type === 'native') {
    return 'XLM';
  }
  return op.asset_code || 'Pool';
};

const Activity: React.FC = () => {
  const [transactionsDetails, setTransactionsDetails] = useState<TxDetail[]>(
    [],
  );
  const { transactions, loading } = useTransactions({
    includeOperations: true,
  });

  const { value } = useProvider();

  const userAddress = value.user.wallet?.address as string;

  const handleGoToExplorer = () => {
    const explorerUrl = getExplorerUrl(
      value.config.networks[0], // todo: fix it to active network
      `account/${value.user.wallet?.address}`,
    );

    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!transactions) {
      return;
    }

    const result: TxDetail[] = [];

    for (const tx of transactions) {
      const op = tx.operations[0];

      const details: TxDetail = {
        hash: tx.hash,
        description: '',
        date: tx.created_at,
        title: toTitleFormat(op.type),
      };

      if (tx.operations.length > 1) {
        details.title = 'Multi Operation';
      } else if (op.type === 'payment') {
        let title = 'Send';

        if (op.to.toLowerCase() === userAddress.toLowerCase()) {
          title = 'Receive';
        }

        details.title = title;
        details.description = `${humanizeAmount(op.amount)} ${handleAssetText(op)}`;
      } else if (
        op.type ===
          Horizon.HorizonApi.OperationResponseType.pathPaymentStrictSend ||
        op.type === Horizon.HorizonApi.OperationResponseType.pathPayment
      ) {
        details.title = 'Swap';
        details.description = `Path payment of ${op.amount} ${handleAssetText(op)}`;
      }

      result.push(details);
    }

    setTransactionsDetails(result);
  }, [transactions]);

  return (
    <div className="bluxcc-h-[348px]">
      {loading ? (
        <div className="bluxcc-flex bluxcc-h-full bluxcc-flex-col bluxcc-items-center bluxcc-justify-center bluxcc-text-center bluxcc-text-gray-700">
          Loading activity...
        </div>
      ) : transactionsDetails.length > 0 ? (
        transactionsDetails.map((tx, index) => (
          <div
            key={index}
            style={{
              borderBottomStyle: 'dashed',
              borderBottomWidth:
                index < transactionsDetails.length - 1
                  ? value.config.appearance.includeBorders
                    ? value.config.appearance.borderWidth
                    : '1px'
                  : '0px',
              borderBottomColor: value.config.appearance.borderColor,
            }}
            className={`bluxcc-p-2`}
          >
            <History tx={tx} />
          </div>
        ))
      ) : (
        <div className="bluxcc-flex bluxcc-h-full bluxcc-flex-col bluxcc-items-center bluxcc-justify-center bluxcc-text-center bluxcc-text-gray-700">
          No activity found
        </div>
      )}

      {transactionsDetails.length > 0 && (
        <Button
          state="enabled"
          variant="outline"
          size="medium"
          className="mt-4"
          onClick={handleGoToExplorer}
        >
          See all in explorer
        </Button>
      )}
    </div>
  );
};

export default Activity;
