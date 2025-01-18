import React from 'react';
import { handleIcons } from '../../utils/handleIcons';

export type Wallet = {
  name: string;
  available: boolean;
};

export const WalletButton = ({ name, available, onClick }: Wallet & { onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between h-14 border border-[#CDCEEE] rounded-full my-2 px-2`}
  >
    <div className="flex items-center font-medium">
      <div className="flex justify-center items-center bg-neutral-300 border rounded-full h-10 w-10 mr-4">
        <div className="h-8 w-8 flex justify-center items-center">{handleIcons(name)}</div>
      </div>
      {name}
    </div>
    {!available && <span className="text-sm text-red-500">Unavailable</span>}
  </button>
);
