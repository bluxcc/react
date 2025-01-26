import React, { useContext } from 'react';

import { ProviderContext } from '../../../context/provider';
import { handleIcons } from '../../../utils/handleIcons';
import { Loading } from '../../../assets/Icons';

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

      <button
        disabled
        className="mt-8 w-full h-14 inline-flex justify-center items-center gap-[10px] border border-[#CDCEEE] rounded-full cursor-default"
      >
        <Loading />
        <p className="font-medium">Connecting</p>
      </button>
    </div>
  );
};

export default Connecting;
