import React, { useContext, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

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
  closeButton = false,
}: ModalProps) => {
  const context = useContext(ProviderContext);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContentHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(contentRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [children]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={`fixed inset-0 ${
              !context?.value.isDemo && 'bg-black bg-opacity-[0.05]'
            } z-40 overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={context?.value.isDemo ? undefined : onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div
              className={clsx(
                'bg-white rounded-2xl border border-[#CDCEEE] font-sans overflow-hidden px-6 pb-4',
                className,
              )}
            >
              {/* Animated Content Container */}
              <motion.div
                initial={{ height: contentHeight }}
                animate={{ height: contentHeight }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <div ref={contentRef} className="">
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
                        <div onClick={onBack}>
                          <ArrowLeft />
                        </div>
                      )}
                    </div>

                    <p className="text-lg font-semibold text-center flex-1 select-none">
                      {modalHeader}
                    </p>

                    {closeButton ? (
                      <div className="cursor-pointer" onClick={onClose}>
                        <Close />
                      </div>
                    ) : (
                      <div className="w-4"> </div>
                    )}
                  </div>
                  {children}
                  {/* Footer */}
                  {!context?.value.isConnecting && (
                    <div className="font-semibold text-[10px] text-center w-full py-2">
                      Powered by{' '}
                      <a href="https://blux.cc" className="text-[#0D1292]" target="blank">
                        Blux.cc
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
