import React, { useEffect } from 'react';

import Button from '../../../components/Button';

import { GreenCheck } from '../../../assets/Icons';
import { useProvider } from '../../../context/provider';
import getExplorerUrl from '../../../utils/stellar/getExplorerUrl';
import capitalizeFirstLetter from '../../../utils/capitalizeFirstLetter';

const Successful = () => {
  const context = useProvider();
  const appearance = context.value.config.appearance;
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
      <div className="bluxcc-z-10 bluxcc-mb-6 bluxcc-flex bluxcc-size-[68px] bluxcc-items-center bluxcc-justify-center bluxcc-overflow-hidden bluxcc-rounded-full bluxcc-bg-[#D9FFF3]">
        <span className="bluxcc-z-20">
          <GreenCheck />
        </span>
      </div>

      <div className="bluxcc-w-full bluxcc-flex-col bluxcc-space-y-2 bluxcc-text-center">
        <p className="bluxcc-text-xl bluxcc-font-semibold">
          {waitingStatus === 'connecting' ? 'Connection' : 'Transaction'}{' '}
          Successful
        </p>
        <p className="bluxcc-text-center bluxcc-text-sm bluxcc-font-medium bluxcc-leading-5">
          {waitingStatus === 'connecting'
            ? `Your account has been successfully connected to ${capitalizeFirstLetter(context.value.config.appName)}`
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

      {/* divider */}
      <div className="bluxcc-flex bluxcc-h-8 bluxcc-w-full bluxcc-items-center bluxcc-justify-center">
        <div
          className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0"
          style={{
            background: appearance.borderColor,
            height: appearance.includeBorders
              ? `${parseFloat(appearance.borderWidth) - 0.25}px`
              : '0.75px',
          }}
        />
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
