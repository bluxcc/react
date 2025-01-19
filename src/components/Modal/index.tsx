import React from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  className?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose = () => {}, children, className }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-[0.15] z-40 overflow-hidden"
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
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
