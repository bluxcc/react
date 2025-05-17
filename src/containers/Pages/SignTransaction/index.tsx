import React from 'react';

import Button from '../../../components/Button';
import hexToRgba from '../../../utils/hexToRgba';
import { useBalance } from '../../../useStellar';
import { useProvider } from '../../../context/provider';
import { Routes, SupportedWallets } from '../../../types';
import humanizeAmount from '../../../utils/humanizeAmount';
import shortenAddress from '../../../utils/shortenAddress';
import Summary from '../../../components/Transaction/Summary';
import getActiveNetworkTitle from '../../../utils/network/getNetworkTitle';
import getTransactionDetails from '../../../utils/stellar/getTransactionDetails';

const SignTransaction = () => {
  const context = useProvider();
  const { balance } = useBalance({ asset: 'native' });

  const appearance = context.value.config.appearance;
  const { xdr, options } = context.value.signTransaction;

  const txDetails = getTransactionDetails(xdr, options.network);

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

  const networkTitle = getActiveNetworkTitle(context.value.activeNetwork);
  const isLobstr = context.value.user.wallet?.name === SupportedWallets.Lobstr;

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
        receiver={txDetails.receiver}
        network={options.network}
        estimatedFee={txDetails.estimatedFee.toString()}
        action={txDetails.action}
      />

      <div
        className="bluxcc-mt-4 bluxcc-inline-flex bluxcc-h-14 bluxcc-w-full bluxcc-items-center bluxcc-justify-between bluxcc-border bluxcc-px-4"
        style={{
          borderRadius: appearance.borderRadius,
          borderColor: appearance.borderColor,
        }}
      >
        <div className="bluxcc-inline-flex bluxcc-items-center bluxcc-gap-1 bluxcc-whitespace-nowrap bluxcc-font-medium">
          <p className="bluxcc-whitespace-nowrap bluxcc-text-sm bluxcc-font-medium">
            Your wallet
          </p>
          <p
            className="bluxcc-mt-0.5 bluxcc-text-xs"
            style={{ color: `${hexToRgba(appearance.textColor, 0.8)}` }}
          >
            {context.value.user.wallet?.address
              ? shortenAddress(context.value.user.wallet.address as string, 5)
              : 'No address found'}
          </p>
        </div>
        <div
          className="bluxcc-overflow-hidden bluxcc-px-[10px] bluxcc-py-2"
          style={{
            borderRadius: appearance.borderRadius,
            backgroundColor: appearance.bgField,
            color: appearance.textColor,
          }}
        >
          <p className="bluxcc-max-w-[90px] bluxcc-text-xs bluxcc-font-normal">
            {balance ? humanizeAmount(balance) : '0'} XLM
          </p>
        </div>
      </div>

      {isLobstr && (
        /* TODO: fox styling */ <p
          style={{
            color: 'orangered',
            fontSize: '12px',
            textAlign: 'center',
            paddingTop: '10px',
          }}
        >
          Ensure that your LOBSTR wallet is set to the {networkTitle} network.
          Otherwise, the transaction will definitely fail.
        </p>
      )}

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
