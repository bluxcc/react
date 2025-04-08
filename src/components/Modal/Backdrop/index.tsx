import React from 'react';

interface BackdropProps {
  isClosing: boolean;
  onClose: () => void;
}

const ModalBackdrop = ({ isClosing, onClose }: BackdropProps) => (
  <div
    className={`fixed inset-0 z-40 bg-black bg-opacity-10 backdrop-blur-[1px] ${
      isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
    }`}
    onClick={onClose}
  />
);

export default ModalBackdrop;
