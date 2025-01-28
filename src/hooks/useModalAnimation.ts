import { useState, useEffect } from 'react';

interface ModalAnimationState {
  isOpening: boolean;
  isClosing: boolean;
  hasTransition: boolean;
}

export const useModalAnimation = (isOpen: boolean) => {
  const [state, setState] = useState<ModalAnimationState>({
    isOpening: true,
    isClosing: false,
    hasTransition: false,
  });

  useEffect(() => {
    if (isOpen && state.isOpening) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, isOpening: false }));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, state.isOpening]);

  const handleClose = (onClose: () => void) => {
    setState((prev) => ({ ...prev, isClosing: true }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, isClosing: false }));
      onClose();
    }, 300);
  };

  return {
    ...state,
    setHasTransition: (value: boolean) => setState((prev) => ({ ...prev, hasTransition: value })),
    handleClose,
  };
};
