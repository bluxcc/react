import React from 'react';

interface BackdropProps {
  isClosing: boolean;
  isSticky?: boolean;
  onClose: () => void;
}

const ModalBackdrop = ({
  isClosing,
  onClose,
  isSticky = false,
}: BackdropProps) => (
  <div
    className={`bluxcc:bg-opacity-10 bluxcc:fixed bluxcc:inset-0 bluxcc:z-40 bluxcc:bg-black ${
      isClosing && !isSticky
        ? 'bluxcc:animate-fadeOut'
        : 'bluxcc:animate-fadeIn'
    }`}
    onClick={onClose}
  />
);

export default ModalBackdrop;
