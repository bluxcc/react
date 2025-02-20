import React from 'react';
import Button from '../../../components/Button';
import { useProvider } from '../../../context/provider';
import { getNetworkByPassphrase } from '../../../utils/getNetworkByPassphrase';
import History from '../../../components/Transaction/History';
import useAccount from '../../../hooks/useAccount';

const Activity: React.FC = () => {
  const context = useProvider();
  const { account } = useAccount({
    publicKey: context.value.user.wallet?.address as string,
    passphrase: context.value.config.networkPassphrase,
  });
  const transactions = account?.transactions || [];
  console.log(account?.transactions);
  const handleGoToExplorer = () => {
    const explorerUrl = `https://stellar.expert/explorer/${getNetworkByPassphrase(
      context.value.config.networkPassphrase,
    )}/${context.value.user.wallet?.address}/tx`;
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };
  // Todo : fix tx values
  return (
    <div>
      <div className="my-4 h-[248px]">
        {transactions.map((tx, index) => (
          <div
            key={index}
            className={`p-2 ${
              index < transactions.length - 1 ? 'border-b border-dashed border-gray-300' : ''
            }`}
          >
            <History
              amount={tx.id.slice(0, 5)}
              date={tx.created_at}
              status={tx.successful ? 'success' : 'failed'}
              action={tx.memo_type}
              hash={tx.hash}
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
