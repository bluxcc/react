import React from 'react';
import { ArrowLeft, Close, InfoIcon } from '../../../assets/Icons';

interface HeaderProps {
  icon: 'info' | 'back';
  onInfo?: () => void;
  onBack?: () => void;
  modalHeader: string;
  closeButton?: boolean;
  onClose: () => void;
}

const ModalHeader: React.FC<HeaderProps> = ({
  icon,
  onInfo,
  onBack,
  modalHeader,
  closeButton = false,
  onClose,
}) => {
  const renderIcon = () => {
    if (icon === 'info') {
      return (
        <button
          onClick={onInfo}
          className="size-6 flex justify-center items-center hover:bg-primary-100 rounded-full transition duration-300"
        >
          <InfoIcon />
        </button>
      );
    }
    return (
      <button onClick={onBack} className="cursor-pointer flex justify-center items-center">
        <ArrowLeft />
      </button>
    );
  };

  return (
    <div className="w-full flex items-center justify-between h-16">
      <div>{renderIcon()}</div>

      <p className="text-lg font-semibold text-center flex-1 select-none">{modalHeader}</p>

      {closeButton ? (
        <button onClick={onClose} className="cursor-pointer">
          <Close />
        </button>
      ) : (
        <div className="w-4" />
      )}
    </div>
  );
};

export default ModalHeader;
