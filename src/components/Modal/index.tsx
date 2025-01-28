import React, { useContext, useEffect } from 'react';
import clsx from 'clsx';
import { ProviderContext } from '../../context/provider';
import ModalHeader from './Header';
import ModalBackdrop from './Backdrop';
import { useModalAnimation } from '../../hooks/useModalAnimation';
import { useModalHeight } from '../../hooks/useModalHeight';

interface ModalProps {
  isOpen: boolean;
  className?: string;
  onClose?: () => void;
  onBack?: () => void;
  children: React.ReactNode;
  icon: 'info' | 'back';
  onInfo?: () => void;
  closeButton?: boolean;
  modalHeader: string;
  initialHeight: number;
}

const Modal = ({
  isOpen,
  onClose = () => {},
  onBack,
  onInfo,
  children,
  className,
  modalHeader,
  icon,
  initialHeight,
  closeButton = false,
}: ModalProps) => {
  const context = useContext(ProviderContext);
  const { isOpening, isClosing, hasTransition, handleClose, setHasTransition } =
    useModalAnimation(isOpen);
  const { contentRef, currentHeight, heightChanged } = useModalHeight(
    isOpen,
    initialHeight,
    children,
  );

  useEffect(() => {
    if (heightChanged) {
      setHasTransition(true);
    }
  }, [heightChanged, setHasTransition]);

  if (!isOpen) return null;

  return (
    <>
      <ModalBackdrop
        isDemo={context?.value.isDemo}
        isClosing={isClosing}
        onClose={() => handleClose(onClose)}
      />

      <div
        className={clsx(
          'absolute inset-0 flex items-center justify-center z-50',
          isClosing && 'animate-fadeOut',
        )}
        onClick={(e) => e.target === e.currentTarget && handleClose(onClose)}
      >
        <div
          className={clsx(
            'bg-white rounded-2xl border border-[#CDCEEE] font-sans overflow-hidden',
            hasTransition && 'transition-all duration-300 ease-in-out',
            className,
          )}
          style={{
            height: `${currentHeight}px`,
            transform: isOpening ? 'scale(0.98)' : 'scale(1)',
            opacity: isOpening ? '0' : '1',
            transition: isOpening
              ? 'transform 300ms ease-out, opacity 300ms ease-out'
              : hasTransition
              ? 'height 300ms ease-in-out'
              : 'none',
          }}
        >
          <div ref={contentRef} className="px-6 pb-4">
            <ModalHeader
              icon={icon}
              onInfo={onInfo}
              onBack={onBack}
              modalHeader={modalHeader}
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
