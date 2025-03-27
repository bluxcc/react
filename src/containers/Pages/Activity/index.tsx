import React from 'react';

import Button from '../../../components/Button';
import History from '../../../components/Transaction/History';

import useAccount from '../../../hooks/useAccount';
import { useProvider } from '../../../context/provider';
import getExplorerUrl from '../../../utils/stellar/getExplorerUrl';

const Activity: React.FC = () => {
  const context = useProvider();
  const { account } = useAccount({
    publicKey: context.value.user.wallet?.address as string,
    passphrase: context.value.config.networks[0], // todo: fix it to active network
  });
  const transactions = account?.transactions || [];

  const handleGoToExplorer = () => {
    const explorerUrl = getExplorerUrl(
      context.value.config.networks[0], // todo: fix it to active network
      `account/${context.value.user.wallet?.address}`,
    );

    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };
  // Todo : fix tx values
  const limitedTransactions = transactions.slice(0, 5);

  return (
    <div>
      <div className="my-4 min-h-[248px]">
        {limitedTransactions.map((tx, index) => (
          <div
            key={index}
            className={`p-2 ${
              index < limitedTransactions.length - 1 ? 'border-b border-dashed border-gray-300' : ''
            }`}
          >
            <History
              amount={tx.others?.amount}
              date={tx.others?.date}
              status={tx.others?.success ? 'success' : 'failed'}
              action={tx.title}
              hash={tx.others?.hash}
            />
          </div>
        ))}
      </div>

      <Button
        state="enabled"
        variant="outline"
        size="medium"
        className="mt-4"
        onClick={handleGoToExplorer}
      >
        See all in explorer
      </Button>
    </div>
  );
};

export default Activity;
