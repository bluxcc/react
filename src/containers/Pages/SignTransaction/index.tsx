import React from 'react';

import Button from '../../../components/Button';
import Summary from '../../../components/Transaction/Summery';

import { useProvider } from '../../../context/provider';

import shortenAddress from '../../../utils/shortenAddress';
import getBorderRadius from '../../../utils/getBorderRadius';
import getTransactionDetails from '../../../utils/stellar/getTransactionDetails';
import { Routes } from '../../../types';
import humanizeAmount from '../../../utils/humanizeAmount';
import useAccount from '../../../hooks/useAccount';

const SignTransaction = () => {
  const context = useProvider();

  const { xdr } = context.value.signTransaction;
  const borderRadius = getBorderRadius(context.value.appearance.cornerRadius);
  const txDetails = getTransactionDetails(xdr);
  const { account } = useAccount({
    publicKey: context.value.user.wallet?.address as string,
    passphrase: context.value.config.networkPassphrase,
  });

  const handleSignTx = async () => {
    context.setValue((prev) => ({
      ...prev,
      isModalOpen: true,
      waitingStatus: 'signing',
    }));
    context.setRoute(Routes.WAITING);
  };

  return (
    <div className="w-full">
      <p className="my-4 text-sm font-medium text-center select-none mx-3">
        <span className="font-semibold capitalize">{context.value.config.appName} </span>wants your
        permission to approve the following transaction.
      </p>

      <Summary
        operationsCount={txDetails.operations}
        sender={txDetails.sender}
        estimatedFee={txDetails.estimatedFee.toString()}
        action={txDetails.action}
      />

      <div
        className="inline-flex items-center h-14 px-4 justify-between border border-primary-100 mt-4 w-full"
        style={{
          borderRadius,
        }}
      >
        <div className="inline-flex items-center gap-2 font-medium">
          <p className="text-sm font-me">Your wallet</p>
          <p className="text-xs text-gray-700">
            {shortenAddress(context.value.user.wallet?.address as string, 5)}
          </p>
        </div>
        <div
          className="bg-lightBlue-100 py-2 px-[10px]"
          style={{
            borderRadius,
          }}
        >
          <p className="text-primary-500 text-xs font-normal">
            {account ? humanizeAmount(account.xlmBalance) : 'N/A'} XLM
          </p>
        </div>
      </div>

      {/* divider */}
      <div className="w-full flex justify-center items-center h-8">
        <div className="absolute left-0 right-0 bg-primary-100 h-[1px]" />
      </div>

      <Button size="large" state="enabled" variant="fill" onClick={handleSignTx}>
        Approve
      </Button>
    </div>
  );
};

export default SignTransaction;
