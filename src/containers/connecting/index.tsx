import React, { useContext } from 'react';

import { ProviderContext } from '../../context/provider';
import { handleIcons } from '../../utils/handleIcons';

const Connecting = () => {
  const context = useContext(ProviderContext);

  return (
    <div className="flex flex-col items-center justify-center h-40">
      <div className="h-20 w-20 flex justify-center items-center mb-4">
        {handleIcons(context?.value.user.wallet?.name as string)}
      </div>
      <p className="text-lg font-medium mb-4">
        Connecting to {context?.value.user.wallet?.name}...
      </p>
    </div>
  );
};

export default Connecting;
