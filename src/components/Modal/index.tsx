import React, { useContext, useEffect, useRef, useState } from 'react';

import { getBorderRadius } from '../../utils/getBorderRadius';
import { useModalAnimation } from '../../hooks/useModalAnimation';
import { ProviderContext } from '../../context/provider';

import ModalHeader from './Header';
import ModalBackdrop from './Backdrop';
import { defaultAppearance } from '../../constants/defaultAppearance';

interface ModalProps {
  isOpen: boolean;
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
  modalHeader,
  icon,
  initialHeight,
  closeButton = false,
}: ModalProps) => {
  const context = useContext(ProviderContext);
  const { isOpening, isClosing, hasTransition, handleClose, setHasTransition } =
    useModalAnimation(isOpen);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [heightChanged, setHeightChanged] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const previousChildrenRef = useRef(children);
  const previousHeightRef = useRef<number>(380);

  const modalStyle = context?.value.appearance || defaultAppearance;

  useEffect(() => {
    if (!isOpen) {
      setContentHeight(null);
      setHeightChanged(false);
      isFirstRender.current = true;
      previousChildrenRef.current = children;
      previousHeightRef.current = initialHeight;
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const updateHeight = () => {
      const newHeight = contentRef.current?.offsetHeight;
      if (!newHeight) return;

      if (isFirstRender.current) {
        previousHeightRef.current = newHeight;
        isFirstRender.current = false;
        return;
      }

      if (newHeight !== previousHeightRef.current) {
        setContentHeight(newHeight);
        setHeightChanged(true);
        previousHeightRef.current = newHeight;
      }
    };
    if (heightChanged) {
      setHasTransition(true);
    }
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(contentRef.current);
    updateHeight();

    return () => resizeObserver.disconnect();
  }, [isOpen, children]);

  const currentHeight = isFirstRender.current
    ? initialHeight
    : contentHeight ?? previousHeightRef.current;

  if (!isOpen) return null;

  return (
    <>
      {!context?.value.isDemo && (
        <ModalBackdrop isClosing={isClosing} onClose={() => handleClose(onClose)} />
      )}

      <div
        className={`absolute inset-0 flex items-center justify-center z-[9999] ${
          isClosing && 'animate-fadeOut'
        }`}
        onClick={(e) => e.target === e.currentTarget && handleClose(onClose)}
      >
        <div
          className="overflow-hidden border !w-[360px]"
          style={{
            height: `${currentHeight}px`,
            transform: isOpening ? 'scale(0.98)' : 'scale(1)',
            opacity: isOpening ? '0' : '1',
            transition: isOpening
              ? 'transform 300ms ease-out, opacity 300ms ease-out'
              : hasTransition
              ? 'height 300ms ease-in-out'
              : 'transition-all',
            backgroundColor: modalStyle.background,
            color: modalStyle.textColor,
            fontFamily: modalStyle.font,
            borderRadius: getBorderRadius(modalStyle.cornerRadius),
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
