import React from 'react';
import { ArrowLeft, Close } from '../../assets/Icons';
import { useProvider } from '../../context/provider';

interface HeaderProps {
  icon?: 'info' | 'back';
  onInfo?: () => void;
  onBack?: () => void;
  title: string;
  closeButton?: boolean;
  onClose: () => void;
}

const Header = ({
  icon,
  onInfo,
  onBack,
  title,
  closeButton = false,
  onClose,
}: HeaderProps) => {
  const context = useProvider();
  return (
    <div className="bluxcc:flex bluxcc:w-full bluxcc:items-center bluxcc:justify-between bluxcc:pb-5">
      {icon === 'info' ? (
        <div
          onClick={onInfo}
          className="bluxcc:flex bluxcc:size-5 bluxcc:items-center bluxcc:justify-center"
        >
          {/* cursor-pointer */}
          {/* <InfoIcon fill={context.value.config.appearance.textColor} /> */}
        </div>
      ) : icon === 'back' ? (
        <div
          onClick={onBack}
          className="bluxcc:flex bluxcc:size-5 bluxcc:cursor-pointer bluxcc:items-center bluxcc:justify-center"
        >
          <ArrowLeft fill={context.value.config.appearance.textColor} />
        </div>
      ) : (
        <div className="bluxcc:size-5" />
      )}

      <p className="bluxcc:grow bluxcc:text-center bluxcc:text-base bluxcc:font-medium bluxcc:select-none">
        {title}
      </p>

      {closeButton ? (
        <div onClick={onClose} className="bluxcc:size-5 bluxcc:cursor-pointer">
          <Close fill={context.value.config.appearance.textColor} />
        </div>
      ) : (
        <div className="bluxcc:size-5" />
      )}
    </div>
  );
};

export default Header;
