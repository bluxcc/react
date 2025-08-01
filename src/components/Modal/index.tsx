import React, { useEffect, useRef, useState } from 'react';

import { useProvider } from '../../context/provider';
import { useModalAnimation } from '../../hooks/useModalAnimation';

import ModalHeader from './Header';
import ModalBackdrop from './Backdrop';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onBack?: () => void;
  children: React.ReactNode;
  icon?: 'info' | 'back';
  onInfo?: () => void;
  closeButton?: boolean;
  title: string;
  isSticky?: boolean;
}

const Modal = ({
  isOpen,
  onClose = () => {},
  onBack,
  onInfo,
  children,
  title,
  icon,
  isSticky = false,
  closeButton = true,
}: ModalProps) => {
  const [height, setHeight] = useState<string | number>('auto');
  const [isMobile, setIsMobile] = useState(false);
  const [heightReady, setHeightReady] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const context = useProvider();
  const { isOpening, isClosing, handleClose } = useModalAnimation(isOpen);

  const { appearance } = context.value.config;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 760);

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    // Initialize height when modal opens
    setHeight(contentRef.current.offsetHeight);
    setHeightReady(true);

    // Set up the resize observer to update height when content changes
    const resizeObserver = new ResizeObserver(() => {
      if (contentRef.current) {
        setHeight(contentRef.current.offsetHeight);
      }
    });

    resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, [isOpen, children]);

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
                ? `${isMobile ? height + 40 : height}px`
                : height,
            transition: heightReady
              ? `height 300ms ease-in-out, border-radius 300ms, opacity 300ms ease-out, outline 300ms ease-out, color 300ms ease-out${isMobile ? ', transform 300ms ease-out' : ''}`
              : `border-radius 300ms, opacity 300ms ease-out${isMobile ? ', transform 300ms ease-out' : ''}`,
            transform: isMobile
              ? isOpening
                ? 'translateY(100%)'
                : isClosing
                  ? 'translateY(100%)'
                  : 'translateY(0%)'
              : 'none',
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
            className={`bluxcc:px-6 bluxcc:pb-4`}
            style={{
              opacity: heightReady ? 1 : 0,
              transition: 'opacity 300ms ease-in-out',
            }}
          >
            <ModalHeader
              icon={icon}
              onInfo={onInfo}
              onBack={onBack}
              title={title}
              closeButton={closeButton}
              onClose={() => handleClose(onClose)}
            />
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
