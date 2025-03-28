import React from 'react';
import { ArrowLeft, Close, InfoIcon } from '../../../assets/Icons';
import { useProvider } from '../../../context/provider';

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
  const context = useProvider();
  return (
    <div
      className="w-full flex items-center justify-between h-16"
      style={{ backgroundColor: context.value.config.appearance.background }}
    >
      {icon === 'info' ? (
        <div
          onClick={onInfo}
          className="flex justify-center items-center rounded-full cursor-pointer size-6"
        >
          <InfoIcon fill={context.value.config.appearance.textColor} />
        </div>
      ) : icon === 'back' ? (
        <div onClick={onBack} className="cursor-pointer flex justify-center items-center size-6">
          <ArrowLeft fill={context.value.config.appearance.textColor} />
        </div>
      ) : (
        <div className="size-6" />
      )}

      <p className="text-lg font-semibold text-center flex-grow select-none">{title}</p>

      {closeButton ? (
        <div onClick={onClose} className="cursor-pointer size-6">
          <Close fill={context.value.config.appearance.textColor} />
        </div>
      ) : (
        <div className="w-6" />
      )}
    </div>
  );
};

export default ModalHeader;
