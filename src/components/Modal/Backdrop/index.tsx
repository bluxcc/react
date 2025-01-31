import React from 'react';
import clsx from 'clsx';

interface BackdropProps {
  isClosing: boolean;
  onClose: () => void;
}

const ModalBackdrop = ({ isClosing, onClose }: BackdropProps) => (
  <div
    className={clsx(
      'fixed inset-0 z-40 bg-black bg-opacity-[0.05]',
      isClosing ? 'animate-fadeOut' : 'animate-fadeIn',
    )}
    onClick={onClose}
  />
);

export default ModalBackdrop;
