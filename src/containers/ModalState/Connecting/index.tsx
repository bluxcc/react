import React, { useContext } from 'react';

import { ProviderContext } from '../../../context/provider';
import { handleIcons } from '../../../utils/handleIcons';
import { Loading } from '../../../assets/Icons';
import Button from '../../../components/Button';

const Connecting = () => {
  const context = useContext(ProviderContext);
  return (
    <div className="flex flex-col items-center justify-center w-full select-none mt-8">
      <div className="h-20 w-20 flex justify-center items-center mb-4">
        {handleIcons(context?.value.user.wallet?.name as string)}
      </div>
      <div className="space-y-3 flex-col text-center font-semibold">
        <p className="text-xl">Waiting for {context?.value.user.wallet?.name}</p>
        <p className="text-sm">Accept connection request in the wallet</p>
      </div>

      <Button
        disabled
        className="mt-8 font-medium w-full inline-flex justify-center items-center gap-[10px] border border-[#CDCEEE] rounded-full cursor-default"
      >
        <Loading />
        <p>Connecting</p>
      </Button>
    </div>
  );
};

export default Connecting;
