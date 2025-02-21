import React, { useEffect } from 'react';

import Button from '../../../components/Button';

import { GreenCheck } from '../../../assets/Icons';
import { useProvider } from '../../../context/provider';
import getExplorerUrl from '../../../utils/stellar/getExplorerUrl';

const Successful = () => {
  const context = useProvider();
  const waitingStatus = context.value.waitingStatus;

  useEffect(() => {
    if (waitingStatus === 'connecting') {
      setTimeout(() => {
        context.setValue((prev) => ({
          ...prev,
          isModalOpen: false,
          isAuthenticated: true,
        }));
      }, 1000);
    }
    if (waitingStatus === 'signing') {
      setTimeout(() => {
        context.setValue((prev) => ({
          ...prev,
          isModalOpen: false,
        }));
      }, 10000);
    }
  }, []);

  const handleGoToExplorer = () => {
    const txHash = context.value.signTransaction.result?.hash;
    if (txHash) {
      const explorerUrl = getExplorerUrl(context.value.config.networkPassphrase, `tx/${txHash}`);

      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full select-none mt-4">
      <div className={`size-12 flex justify-center rounded-full overflow-hidden items-center mb-6`}>
        <GreenCheck />
      </div>

      <div className="space-y-1 w-full flex-col text-center">
        <p className="text-xl font-semibold">
          {waitingStatus === 'connecting' ? 'Connection' : 'Transaction'} Successful
        </p>
        <p className="text-sm text-center font-medium leading-5">
          {waitingStatus === 'connecting'
            ? 'Your account has been successfully connected'
            : 'Your transaction was successfully completed'}
        </p>
      </div>
      {waitingStatus === 'signing' && (
        <Button
          state="enabled"
          variant="outline"
          size="small"
          className="mt-4"
          onClick={handleGoToExplorer}
        >
          See in explorer
        </Button>
      )}

      <div className="w-full my-4">
        <div className="absolute left-0 right-0 bg-primary-100 h-[1px]" />
      </div>

      {waitingStatus === 'connecting' ? (
        <Button state="enabled" variant="outline">
          Logging In
        </Button>
      ) : (
        <Button state="enabled" variant="fill">
          Done
        </Button>
      )}
    </div>
  );
};

export default Successful;
