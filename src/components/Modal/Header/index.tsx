import React from 'react';
import { ArrowLeft, Close } from '../../../assets/Icons';
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
      className="w-full flex items-center justify-between h-[60px]"
      style={{ backgroundColor: context.value.config.appearance.background }}
    >
      {icon === 'info' ? (
        <div onClick={onInfo} className="flex justify-center items-center size-5">
          {/* cursor-pointer */}
          {/* <InfoIcon fill={context.value.config.appearance.textColor} /> */}
        </div>
      ) : icon === 'back' ? (
        <div onClick={onBack} className="cursor-pointer flex justify-center items-center size-5">
          <ArrowLeft fill={context.value.config.appearance.textColor} />
        </div>
      ) : (
        <div className="size-5" />
      )}

      <p className="text-base font-semibold text-center flex-grow select-none">{title}</p>

      {closeButton ? (
        <div onClick={onClose} className="cursor-pointer size-5">
          <Close fill={context.value.config.appearance.textColor} />
        </div>
      ) : (
        <div className="size-5" />
      )}
    </div>
  );
};

export default ModalHeader;
