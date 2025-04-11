import React, { useEffect, useRef, useState } from 'react';
import { useProvider } from '../../context/provider';
import { useModalAnimation } from '../../hooks/useModalAnimation';
import getBorderRadius from '../../utils/getBorderRadius';
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
}

const Modal = ({
  isOpen,
  onClose = () => {},
  onBack,
  onInfo,
  children,
  title,
  icon,
  closeButton = true,
}: ModalProps) => {
  const [height, setHeight] = useState<string | number>('auto');
  const [isMobile, setIsMobile] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const context = useProvider();
  const { isOpening, isClosing, handleClose } = useModalAnimation(isOpen);

  const { appearance } = context.value.config;
  const borderRadius = getBorderRadius(appearance.cornerRadius);

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
        <ModalBackdrop isClosing={isClosing} onClose={() => handleClose(onClose)} />
      )}

      <div
        className={`absolute inset-0 flex items-center justify-center z-[9999] ${
          isClosing && 'animate-fadeOut'
        }`}
        onClick={(e) => e.target === e.currentTarget && handleClose(onClose)}
      >
        <div
          className={`overflow-hidden shadow-[0px_4px_80px_0px_#00000008] border border-primary-100 box-border transition-all ${
            isMobile
              ? 'fixed bottom-0 left-0 w-full max-h-[90vh] !rounded-b-none'
              : 'relative !w-[360px]'
          }`}
          style={{
            height: typeof height === 'number' ? `${height}px` : height,
            opacity: isClosing ? '0' : '1',
            transform: isMobile
              ? isOpening
                ? 'translateY(100%)'
                : isClosing
                ? 'translateY(100%)'
                : 'translateY(0%)'
              : 'none',
            transition: `height 300ms ease-in-out, border-radius 300ms, opacity 300ms ease-out${
              isMobile ? ', transform 300ms ease-out' : ''
            }`,
            backgroundColor: appearance.background,
            color: appearance.textColor,
            fontFamily: appearance.font,
            letterSpacing: '-0.04px',
            borderRadius,
          }}
        >
          <div ref={contentRef} className="px-6 pb-4">
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
