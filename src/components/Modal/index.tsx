import React, { useContext } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

import { ArrowLeft, Close, InfoIcon } from '../../assets/Icons';
import { ProviderContext } from '../../context/provider';

interface ModalProps {
  isOpen: boolean;
  className?: string;
  onClose?: () => void;
  children: React.ReactNode;
  icon: 'info' | 'back';
  closeButton?: boolean;
  modalHeader: string;
}

const Modal = ({
  isOpen,
  onClose = () => {},
  children,
  className,
  modalHeader,
  icon,
  closeButton = false,
}: ModalProps) => {
  const context = useContext(ProviderContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={`fixed inset-0 ${
              !context?.value.isDemo && 'bg-black bg-opacity-[0.05]'
            }  z-40 overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={context?.value.isDemo ? undefined : onClose}
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              willChange: 'transform, opacity',
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              layout
              className={clsx(
                'px-6 py-4 bg-white rounded-2xl border border-[#CDCEEE] font-sans',
                className,
              )}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 40,
              }}
            >
              <div className="w-full flex items-center justify-between pt-0.5 pb-[18px] cursor-pointer">
                {icon === 'info' ? (
                  <div className="w-6 h-6 flex justify-center items-center hover:bg-[#cdceee48] rounded-full transition duration-300">
                    <InfoIcon />
                  </div>
                ) : (
                  <div>
                    <ArrowLeft />
                  </div>
                )}

                <p className="text-lg font-semibold text-center flex-1 select-none">
                  {modalHeader}
                </p>

                {closeButton ? (
                  <div className="cursor-pointer">
                    <Close />
                  </div>
                ) : (
                  <div className="w-4"> </div>
                )}
              </div>
              {children}
              <div className="font-semibold text-[10px] text-center w-full">
                Powered by{' '}
                <a href="https://blux.cc" className=" text-[#0D1292]" target="blank">
                  Blux.cc
                </a>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
