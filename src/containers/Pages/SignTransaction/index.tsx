import React, { useContext, useEffect } from 'react';

import { ProviderContext } from '../../../context/provider';
import { defaultAppearance } from '../../../constants/defaultAppearance';

import shortenAddress from '../../../utils/shortenAddress';
import { getBorderRadius } from '../../../utils/getBorderRadius';
import Button from '../../../components/Button';
import TransactionSummary from '../../../components/TransactionSummery';

const SignTransaction = () => {
  const context = useContext(ProviderContext);
  const modalStyle = context?.value.appearance || defaultAppearance;

  useEffect(() => {
    handleSignTx();
  }, [context?.value?.availableWallets, context?.value?.user?.wallet?.name]);

  const handleSignTx = async () => {
    try {
      if (!context?.value?.user?.wallet?.name || !context?.value?.availableWallets) return;

      const userWallet = context.value.availableWallets.find(
        (wallet) => wallet.name === context?.value?.user?.wallet?.name,
      );

      if (userWallet?.signTransaction) {
        const signedXdr = await userWallet.signTransaction('your_xdr_here', {
          networkPassphrase: 'Test SDF Network ; September 2015', // Example
        });

        console.log('Signed XDR:', signedXdr);
      }
    } catch (error) {
      console.error('Error signing transaction:', error);
    }
  };

  return (
    <div className="w-full tracking-[-2%]">
      <div className="inline-flex my-4 px-4 text-sm font-medium text-center select-none">
        <p className="font-semibold capitalize">{context?.value.config.appName} </p>
        <p> wants your permission to approve the following transaction.</p>
      </div>

      <TransactionSummary
        action="Approve"
        operations={3}
        sender={'GA5F63ORVJ3X4PMGGVCFDDLU6IH233WPREGM3PTPG5NODJTTYQSPWL3H'}
        receiver={'GA5F63ORVJ3X4PMGGVCFDDLU6IH233WPREGM3PTPG5NODJTTYQSPWL3H'}
        estimatedFee={'2.00'}
      />

      <div
        className="inline-flex items-center h-14 px-4 justify-between border border-primary-100 mt-4 w-full"
        style={{
          borderRadius: getBorderRadius(modalStyle.cornerRadius),
        }}
      >
        <div className="inline-flex items-center gap-2 font-medium">
          <p className="text-sm font-me">Your wallet</p>
          <p className="text-xs text-gray-700">
            {shortenAddress(context?.value.user.wallet?.address as string, 5)}
          </p>
        </div>
        <div
          className="bg-lightBlue-100 py-2 px-[10px]"
          style={{
            borderRadius: getBorderRadius(modalStyle.cornerRadius),
          }}
        >
          <p className="text-primary-500 font-normal">234 XLM</p>
        </div>
      </div>

      {/* divider */}
      <div className="w-full my-4 mb-8">
        <div className="absolute left-0 right-0 bg-primary-100 h-[1px]" />
      </div>

      <Button size="large" state="enabled" variant="fill" onClick={handleSignTx}>
        Approve
      </Button>
    </div>
  );
};

export default SignTransaction;
