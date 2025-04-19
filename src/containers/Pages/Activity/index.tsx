import React from 'react';

import Button from '../../../components/Button';
import History from '../../../components/Transaction/History';

import useAccount from '../../../hooks/useAccount';
import { useProvider } from '../../../context/provider';
import getExplorerUrl from '../../../utils/stellar/getExplorerUrl';

const Activity: React.FC = () => {
  const context = useProvider();
  const { account, loading } = useAccount({
    publicKey: context.value.user.wallet?.address as string,
    passphrase: context.value.config.networks[0], // todo: fix it to active network
  });

  const transactions = account?.transactions || [];
  const limitedTransactions = transactions.slice(0, 5);

  const handleGoToExplorer = () => {
    const explorerUrl = getExplorerUrl(
      context.value.config.networks[0], // todo: fix it to active network
      `account/${context.value.user.wallet?.address}`,
    );

    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };

  // todo: fix history
  return (
    <div>
      <div className="bluxcc-my-4 bluxcc-h-[250px]">
        {loading ? (
          <div className="bluxcc-flex bluxcc-h-full bluxcc-flex-col bluxcc-items-center bluxcc-justify-center bluxcc-text-center bluxcc-text-gray-700">
            Loading activity...
          </div>
        ) : limitedTransactions.length > 0 ? (
          limitedTransactions.map((tx, index) => (
            <div
              key={index}
              className={`bluxcc-p-2 ${
                index < limitedTransactions.length - 1
                  ? 'bluxcc-border-b bluxcc-border-dashed bluxcc-border-gray-300'
                  : ''
              }`}
            >
              <History
                amount={'1234.56'}
                // @ts-ignore: todo this should be fixed later
                date={tx.title}
                status={'success'}
                // @ts-ignore: todo this should be fixed later
                action={tx.title}
                // @ts-ignore: todo this should be fixed later
                hash={tx.title}
              />
            </div>
          ))
        ) : (
          <div className="bluxcc-flex bluxcc-h-full bluxcc-flex-col bluxcc-items-center bluxcc-justify-center bluxcc-text-center bluxcc-text-gray-700">
            No activity found
          </div>
        )}
      </div>

      {limitedTransactions.length > 0 && (
        <Button
          state="enabled"
          variant="outline"
          size="medium"
          className="bluxcc-mt-6"
          onClick={handleGoToExplorer}
        >
          See all in explorer
        </Button>
      )}
    </div>
  );
};

export default Activity;
