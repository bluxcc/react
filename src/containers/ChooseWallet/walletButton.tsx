import React, { JSX } from 'react';
import { SupportedWallets } from '../../types';
import { handleIcons } from '../../utils/handleIcons';

export type Wallet = {
  wallet: SupportedWallets;
  name: string;
  icon: () => JSX.Element;
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
    {available && (
      <p className="text-slate-700 bg-slate-200 text-center text-sm py-1 px-2 rounded-md">
        Available
      </p>
    )}
  </button>
);
