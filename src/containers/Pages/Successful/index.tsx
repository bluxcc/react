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
      const explorerUrl = getExplorerUrl(
        context.value.config.networks[0],
        `tx/${txHash}`,
      ); // todo: fix networks

      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bluxcc-mt-4 bluxcc-flex bluxcc-w-full bluxcc-select-none bluxcc-flex-col bluxcc-items-center bluxcc-justify-center">
      <div
        className={`bluxcc-mb-6 bluxcc-flex bluxcc-size-12 bluxcc-items-center bluxcc-justify-center bluxcc-overflow-hidden bluxcc-rounded-full`}
      >
        <GreenCheck />
      </div>

      <div className="bluxcc-w-full bluxcc-flex-col bluxcc-space-y-1 bluxcc-text-center">
        <p className="bluxcc-text-xl bluxcc-font-semibold">
          {waitingStatus === 'connecting' ? 'Connection' : 'Transaction'}{' '}
          Successful
        </p>
        <p className="bluxcc-text-center bluxcc-text-sm bluxcc-font-medium bluxcc-leading-5">
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

      <div className="bluxcc-my-4 bluxcc-w-full">
        <div className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0 bluxcc-h-[1px] bluxcc-bg-primary-100" />
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
