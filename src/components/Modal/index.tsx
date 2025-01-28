import React, { useContext, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ArrowLeft, Close, InfoIcon } from '../../assets/Icons';
import { ProviderContext } from '../../context/provider';

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
  const [isOpening, setIsOpening] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [hasTransition, setHasTransition] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const isFirstRender = useRef(true);
  const previousChildrenRef = useRef(children);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousHeightRef = useRef<number>(initialHeight);

  useEffect(() => {
    if (isOpen && isOpening) {
      const timer = setTimeout(() => {
        setIsOpening(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setContentHeight(null);
      setHasTransition(false);
      previousChildrenRef.current = children;
      isFirstRender.current = true;
      setIsOpening(true);
      previousHeightRef.current = initialHeight;
      return;
    }
  }, [isOpen, initialHeight]);

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
        setHasTransition(true);
        previousHeightRef.current = newHeight;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(contentRef.current);

    updateHeight();

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen, children]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleBack = () => {
    if (onBack) {
      previousHeightRef.current = contentHeight ?? initialHeight;
      onBack();
    }
  };

  const currentHeight = isFirstRender.current
    ? initialHeight
    : contentHeight ?? previousHeightRef.current;

  return (
    isOpen && (
      <>
        <div
          className={clsx(
            'fixed inset-0 z-40',
            !context?.value.isDemo && 'bg-black bg-opacity-[0.05]',
            isClosing ? 'animate-fadeOut' : 'animate-fadeIn',
          )}
          onClick={context?.value.isDemo ? undefined : handleClose}
        />

        <div
          className={clsx(
            'absolute inset-0 flex items-center justify-center z-50',
            isClosing && 'animate-fadeOut',
          )}
          onClick={(e) => e.target === e.currentTarget && handleClose}
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
            <div ref={contentRef} className=" px-6 pb-4">
              <div className="w-full flex items-center justify-between h-16">
                <div className="cursor-pointer">
                  {icon === 'info' ? (
                    <div
                      onClick={onInfo}
                      className="w-6 h-6 flex justify-center items-center hover:bg-[#cdceee48] rounded-full transition duration-300"
                    >
                      <InfoIcon />
                    </div>
                  ) : (
                    <div onClick={handleBack}>
                      <ArrowLeft />
                    </div>
                  )}
                </div>

                <p className="text-lg font-semibold text-center flex-1 select-none">
                  {modalHeader}
                </p>

                {closeButton ? (
                  <div className="cursor-pointer" onClick={handleClose}>
                    <Close />
                  </div>
                ) : (
                  <div className="w-4"> </div>
                )}
              </div>

              {children}
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Modal;
