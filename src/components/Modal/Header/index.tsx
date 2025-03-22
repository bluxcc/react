import React from 'react';
import { ArrowLeft, Close, InfoIcon } from '../../../assets/Icons';

interface HeaderProps {
  icon?: 'info' | 'back';
  onInfo?: () => void;
  onBack?: () => void;
  title: string;
  closeButton?: boolean;
  onClose: () => void;
}

const ModalHeader = ({
  icon,
  onInfo,
  onBack,
  title,
  closeButton = false,
  onClose,
}: HeaderProps) => {
  return (
    <div className="w-full flex items-center justify-between h-16">
      {icon === 'info' ? (
        <button
          onClick={onInfo}
          className="size-6 flex justify-center items-center hover:bg-gray-100 rounded-full transition duration-300"
        >
          <InfoIcon />
        </button>
      ) : icon === 'back' ? (
        <button onClick={onBack} className="size-6 cursor-pointer flex justify-center items-center">
          <ArrowLeft />
        </button>
      ) : (
        <div className="size-6" />
      )}

      <p className="text-lg font-semibold text-center flex-grow select-none">{title}</p>

      {closeButton ? (
        <button onClick={onClose} className="cursor-pointer">
          <Close />
        </button>
      ) : (
        <div className="w-6" />
      )}
    </div>
  );
};

export default ModalHeader;
