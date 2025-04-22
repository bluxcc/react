import React, { useEffect } from 'react';

import Button from '../../../components/Button';
import { GreenCheck } from '../../../assets/Icons';
import { useProvider } from '../../../context/provider';
import getExplorerUrl from '../../../utils/stellar/getExplorerUrl';
import capitalizeFirstLetter from '../../../utils/capitalizeFirstLetter';
import { Horizon, rpc } from '@stellar/stellar-sdk';

const Successful = () => {
  const context = useProvider();
  const waitingStatus = context.value.waitingStatus;
  const appearance = context.value.config.appearance;
  const { result, options } = context.value.signTransaction;

  let hash;

  if (result) {
    if (options.isSoroban) {
      const res = result as rpc.Api.GetSuccessfulTransactionResponse;

      hash = res.txHash;
    } else {
      const res = result as Horizon.HorizonApi.SubmitTransactionResponse;

      hash = res.hash;
    }
  }

  const explorerUrl = hash
    ? getExplorerUrl(
        options.network,
        context.value.config.explorer,
        'transactionUrl',
        hash,
      )
    : null;

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
  }, []);

  const handleGoToExplorer = () => {
    if (explorerUrl) {
      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDone = () => {
    context.setValue((prev) => ({
      ...prev,
      isModalOpen: false,
    }));

    if (waitingStatus === 'signing') {
      const { resolver, result } = context.value.signTransaction;

      if (resolver && result) {
        resolver(result);
      }
    }
  };

  return (
    <div className="bluxcc-mt-4 bluxcc-flex bluxcc-w-full bluxcc-select-none bluxcc-flex-col bluxcc-items-center bluxcc-justify-center">
      <div className="bluxcc-z-10 bluxcc-mb-6 bluxcc-flex bluxcc-size-[68px] bluxcc-items-center bluxcc-justify-center bluxcc-overflow-hidden bluxcc-rounded-full bluxcc-bg-[#D9FFF3]">
        <span className="bluxcc-z-20">
          <GreenCheck />
        </span>
      </div>

      <div className="bluxcc-w-full bluxcc-flex-col bluxcc-space-y-2 bluxcc-text-center bluxcc-font-medium">
        <p className="bluxcc-text-xl">
          {waitingStatus === 'connecting' ? 'Connection' : 'Transaction'}{' '}
          Successful
        </p>
        <p className="bluxcc-text-center bluxcc-text-sm bluxcc-leading-5">
          {waitingStatus === 'connecting'
            ? `Your account has been successfully connected to ${capitalizeFirstLetter(context.value.config.appName)}`
            : 'Your transaction was successfully completed'}
        </p>
      </div>
      {waitingStatus === 'signing' &&
        hash &&
        typeof explorerUrl == 'string' && (
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
            borderTopWidth: appearance.includeBorders
              ? appearance.borderWidth
              : '1px',
            borderTopColor: appearance.borderColor,
          }}
        />
      </div>

      {waitingStatus === 'connecting' ? (
        <Button
          state="enabled"
          variant="outline"
          className="!bluxcc-cursor-default"
        >
          Logging In
        </Button>
      ) : (
        <Button
          state="enabled"
          variant="fill"
          size="large"
          onClick={handleDone}
        >
          Done
        </Button>
      )}
    </div>
  );
};

export default Successful;
