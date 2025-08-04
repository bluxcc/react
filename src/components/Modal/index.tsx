import React, { useRef } from 'react';

import { useProvider } from '../../context/provider';
import { useModalAnimation } from '../../hooks/useModalAnimation';
import ModalBackdrop from './Backdrop';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useDynamicHeight } from '../../hooks/useDynamicHeight';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  isSticky?: boolean;
}

const Modal = ({
  isOpen,
  onClose = () => {},
  children,
  isSticky = false,
}: ModalProps) => {
  const context = useProvider();
  const contentRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const { isOpening, isClosing, handleClose } = useModalAnimation(isOpen);
  const { height, ready: heightReady } = useDynamicHeight(contentRef, [
    isOpen,
    children,
  ]);

  const { appearance } = context.value.config;

  if (!isOpen) return null;

  return (
    <>
      {!context.value.isDemo && (
        <ModalBackdrop
          isClosing={isClosing}
          isSticky={isSticky}
          onClose={() => handleClose(onClose)}
        />
      )}

      <div
        className={`bluxcc:absolute bluxcc:inset-0 bluxcc:z-9999 bluxcc:flex bluxcc:items-center bluxcc:justify-center ${
          isClosing && !isSticky && 'bluxcc:animate-fadeOut'
        }`}
        onClick={(e) => e.target === e.currentTarget && handleClose(onClose)}
      >
        <div
          className={`bluxcc:box-border bluxcc:!shadow-[0px_4px_80px_0px_#00000008] ${
            isMobile
              ? 'bluxcc:fixed bluxcc:bottom-0 bluxcc:left-0 bluxcc:max-h-[90vh] bluxcc:w-full bluxcc:!rounded-b-none'
              : 'bluxcc:relative bluxcc:!w-[360px]'
          }`}
          style={{
            height:
              typeof height === 'number'
                ? `${isMobile ? height + 20 : height}px`
                : height,
            transition: heightReady
              ? `height 250ms ease-in-out, border-radius 250ms, opacity 250ms ease-out, outline 250ms ease-out, color 250ms ease-out${
                  isMobile ? ', transform 250ms ease-out' : ''
                }`
              : `border-radius 250ms, opacity 250ms ease-out${
                  isMobile ? ', transform 250ms ease-out' : ''
                }`,
            transform:
              isMobile && (isOpening || isClosing)
                ? 'translateY(100%)'
                : 'translateY(0%)',
            backgroundColor: appearance.background,
            opacity: isClosing && !isSticky ? '0' : '1',
            color: appearance.textColor,
            fontFamily: appearance.font,
            letterSpacing: '-0.04px',
            outlineStyle: 'solid',
            outlineColor: appearance.borderColor,
            outlineWidth: appearance.borderWidth,
            borderRadius: appearance.borderRadius,
            overflow: 'hidden',
          }}
        >
          <div
            ref={contentRef}
            className={`bluxcc:px-6 bluxcc:pt-5 bluxcc:pb-4`}
            style={{
              opacity: heightReady ? 1 : 0,
              transition: 'opacity 250ms ease-in-out',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
