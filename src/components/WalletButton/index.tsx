import React from 'react';
import { handleIcons } from '../../utils/handleIcons';
import { ArrowRight } from '../../assets/Icons';

export type Wallet = {
  name: string;
  onClick: () => void;
  customIcon?: React.JSX.Element;
  hasArrow?: boolean;
};

export const WalletButton = ({ name, onClick, customIcon, hasArrow = false }: Wallet) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between h-14 border border-[#CDCEEE] rounded-full my-2 pl-2 pr-4`}
  >
    <div className="flex items-center font-medium">
      <div className="flex justify-center items-center border border-transparent rounded-full h-10 w-10 mr-4">
        {customIcon ? customIcon : handleIcons(name)}
      </div>
      {name}
    </div>
    {hasArrow && (
      <div>
        <ArrowRight />
      </div>
    )}
  </button>
);
