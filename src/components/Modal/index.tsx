import React from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

import { InfoIcon } from '../../assets/Icons';

interface ModalProps {
  isOpen: boolean;
  className?: string;
  onClose?: () => void;
  children: React.ReactNode;
  showInfoIcon?: boolean;
  modalStatus: 'connected' | 'notConnected';
}

const Modal = ({
  isOpen,
  onClose = () => {},
  children,
  className,
  modalStatus,
  showInfoIcon = true,
}: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-[0.05] z-40 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
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
              <div className="w-full flex items-center justify-between pt-0.5 pb-[18px]">
                {showInfoIcon ? (
                  <div className="w-7 h-7 flex justify-center items-center hover:bg-[#CDCEEE] border rounded-full transition duration-300 cursor-pointer">
                    <InfoIcon />
                  </div>
                ) : (
                  <div className="w-4"></div>
                )}

                <p className="text-lg font-semibold text-center flex-1 select-none">
                  {modalStatus == 'connected' ? 'Connected' : 'Connect Wallet'}
                </p>

                <div className="w-4"></div>
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
