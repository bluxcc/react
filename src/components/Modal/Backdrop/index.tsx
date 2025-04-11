import React from 'react';

interface BackdropProps {
  isClosing: boolean;
  onClose: () => void;
}

const ModalBackdrop = ({ isClosing, onClose }: BackdropProps) => (
  <div
    className={`bluxcc-fixed bluxcc-inset-0 bluxcc-z-40 bluxcc-bg-black bluxcc-bg-opacity-10 bluxcc-backdrop-blur-[1px] ${
      isClosing ? 'bluxcc-animate-fadeOut' : 'bluxcc-animate-fadeIn'
    }`}
    onClick={onClose}
  />
);

export default ModalBackdrop;
