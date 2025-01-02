import React from 'react';
import { handleIcons } from '../../utils/handleIcons';

export type Wallet = {
  name: string;
  available: boolean;
};

export const WalletButton = ({ name, available, onClick }: Wallet & { onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between h-12 border shadow-md rounded-lg my-2 p-2 transition duration-200 ${
      available ? 'hover:bg-slate-100 border-slate-200' : 'border-gray-300'
    }`}
  >
    <div className="flex items-center">
      <div className="h-8 w-8 mr-4 flex justify-center items-center">{handleIcons(name)}</div>
      {name}
    </div>
    {!available && <span className="text-sm text-red-500">Unavailable</span>}
  </button>
);
