import React, { useContext } from 'react';

import { ProviderContext } from '../../../context/provider';

type ConnectedProps = {
  closeModal: () => void;
};

const Connected = ({ closeModal }: ConnectedProps) => {
  const context = useContext(ProviderContext);

  return (
    <div className="flex flex-col items-center justify-center h-40">
      <p className="text-lg font-medium">Connected to wallet</p>
      <p className="text-sm text-gray-600">{context?.value.user.wallet?.address}</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={closeModal}>
        Close
      </button>
    </div>
  );
};

export default Connected;
