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
  initialHeight: number;
}

const Modal = ({
  isOpen,
  onClose = () => {},
  onBack,
  onInfo,
  children,
  title,
  icon,
  initialHeight,
  closeButton = true,
}: ModalProps) => {
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [heightChanged, setHeightChanged] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const context = useProvider();
  const { isOpening, isClosing, hasTransition, handleClose, setHasTransition } =
    useModalAnimation(isOpen);

  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const previousChildrenRef = useRef(children);
  const previousHeightRef = useRef<number>(400);

  const appearance = context.value.appearance;
  const borderRadius = getBorderRadius(appearance.cornerRadius);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 450);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateHeight = () => {
    const newHeight = contentRef.current?.offsetHeight;
    if (!newHeight) return;

    if (isFirstRender.current) {
      previousHeightRef.current = newHeight;
      isFirstRender.current = false;
      return;
    }
    if (!isFirstRender.current && newHeight !== previousHeightRef.current) {
      setContentHeight(newHeight);
      setHeightChanged(true);
      previousHeightRef.current = newHeight;
    }
  };

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    if (heightChanged) {
      setHasTransition(true);
    }
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(contentRef.current);
    updateHeight();

    return () => resizeObserver.disconnect();
  }, [isOpen, children]);

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

  const currentHeight = isFirstRender.current
    ? initialHeight
    : contentHeight ?? previousHeightRef.current;

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
              : 'relative w-[360px]'
          }`}
          style={{
            height: `${currentHeight}px`,
            opacity: isOpening ? '0' : '1',
            transition: isOpening
              ? 'transform 300ms ease-out, opacity 300ms ease-out'
              : hasTransition
              ? 'height 300ms ease-in-out'
              : 'transition-all',
            backgroundColor: appearance.background,
            color: appearance.textColor,
            fontFamily: appearance.font,
            letterSpacing: '-0.03px',
            borderRadius,
          }}
        >
          <div ref={contentRef} className="px-6 pb-4 transition-all">
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
