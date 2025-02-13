import React, { useContext, useEffect } from 'react';
import { ProviderContext } from '../../../context/provider';

const SignTransaction = () => {
  const context = useContext(ProviderContext);

  useEffect(() => {
    const signTransaction = async () => {
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

    signTransaction();
  }, [context?.value?.availableWallets, context?.value?.user?.wallet?.name]);

  return (
    <div className="flex flex-col items-center justify-center w-full select-none mt-8">
      Sign transaction modal
    </div>
  );
};

export default SignTransaction;
