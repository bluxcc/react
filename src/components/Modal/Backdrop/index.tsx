import React from 'react';
import clsx from 'clsx';

interface BackdropProps {
  isDemo?: boolean;
  isClosing: boolean;
  onClose: () => void;
}

const ModalBackdrop = ({ isDemo, isClosing, onClose }: BackdropProps) => (
  <div
    className={clsx(
      'fixed inset-0 z-40',
      !isDemo && 'bg-black bg-opacity-[0.05]',
      isClosing ? 'animate-fadeOut' : 'animate-fadeIn',
    )}
    onClick={isDemo ? undefined : onClose}
  />
);

export default ModalBackdrop;
