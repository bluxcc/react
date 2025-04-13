import React from 'react';

import { Routes } from '../../../types';
import Button from '../../../components/Button';
import useAccount from '../../../hooks/useAccount';
import { useProvider } from '../../../context/provider';
import humanizeAmount from '../../../utils/humanizeAmount';
import shortenAddress from '../../../utils/shortenAddress';
import getBorderRadius from '../../../utils/getBorderRadius';
import Summary from '../../../components/Transaction/Summery';
import getTransactionDetails from '../../../utils/stellar/getTransactionDetails';

const SignTransaction = () => {
  const context = useProvider();

  const { xdr, network } = context.value.signTransaction;
  
  const borderRadius = getBorderRadius(
    context.value.config.appearance.cornerRadius,
  );
  const txDetails = getTransactionDetails(xdr, network);
  const { account } = useAccount({
    publicKey: context.value.user.wallet?.address as string,
    passphrase: network,
  });

  const handleSignTx = async () => {
    context.setValue((prev) => ({
      ...prev,
      isModalOpen: true,
      waitingStatus: 'signing',
    }));

    context.setRoute(Routes.WAITING);
  };

  if (!txDetails) {
    return (
      <div>
        <p>Invalid XDR</p>
      </div>
    );
  }

  return (
    <div className="bluxcc-w-full">
      <p className="bluxcc-mx-3 bluxcc-my-4 bluxcc-select-none bluxcc-text-center bluxcc-text-sm bluxcc-font-medium">
        <span className="bluxcc-font-semibold bluxcc-capitalize">
          {context.value.config.appName}{' '}
        </span>
        wants your permission to approve the following transaction.
      </p>

      <Summary
        operationsCount={txDetails.operations}
        sender={txDetails.sender}
        estimatedFee={txDetails.estimatedFee.toString()}
        action={txDetails.action}
      />

      <div
        className="bluxcc-mt-4 bluxcc-inline-flex bluxcc-h-14 bluxcc-w-full bluxcc-items-center bluxcc-justify-between bluxcc-border bluxcc-border-primary-100 bluxcc-px-4"
        style={{
          borderRadius,
        }}
      >
        <div className="bluxcc-inline-flex bluxcc-items-center bluxcc-gap-1 bluxcc-whitespace-nowrap bluxcc-font-medium">
          <p className="bluxcc-whitespace-nowrap bluxcc-text-sm bluxcc-font-medium">
            Your wallet
          </p>
          <p className="bluxcc-text-xs bluxcc-text-gray-700">
            {shortenAddress(context.value.user.wallet?.address as string, 5)}
          </p>
        </div>
        <div
          className="bluxcc-overflow-hidden bluxcc-bg-lightBlue-100 bluxcc-px-[10px] bluxcc-py-2"
          style={{
            borderRadius,
          }}
        >
          <p className="bluxcc-max-w-[90px] bluxcc-text-xs bluxcc-font-normal bluxcc-text-primary-500">
            {account ? humanizeAmount(account.xlmBalance) : 'N/A'} XLM
          </p>
        </div>
      </div>

      {/* divider */}
      <div className="bluxcc-flex bluxcc-h-8 bluxcc-w-full bluxcc-items-center bluxcc-justify-center">
        <div className="bluxcc-absolute bluxcc-left-0 bluxcc-right-0 bluxcc-h-[1px] bluxcc-bg-primary-100" />
      </div>

      <Button
        size="large"
        state="enabled"
        variant="fill"
        onClick={handleSignTx}
      >
        Approve
      </Button>
    </div>
  );
};

export default SignTransaction;
