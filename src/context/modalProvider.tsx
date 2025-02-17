import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ModalRoute, Routes } from '../types';
import { useBluxProvider } from './bluxProvider';

interface ModalContextType {
  route: ModalRoute;
  setModalRoute: (route: ModalRoute) => void;
  goBack: () => void;
  setShowAllWallets: (show: boolean) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const { value } = useBluxProvider();

  const [route, setRoute] = useState<ModalRoute>({
    route: Routes.ONBOARDING,
    showAllWallets: false,
  });

  useEffect(() => {
    if (value.isAuthenticated && !value.signTx.openModal) {
      setRoute({ route: Routes.PROFILE, showAllWallets: false });
    } else if (value.isConnecting) {
      setRoute({ route: Routes.CONNECTING, showAllWallets: false });
    } else if (value.signTx.openModal) {
      setRoute({ route: Routes.SIGN_TRANSACTION, showAllWallets: false });
    } else if (value.connectSuccess) {
      setRoute({ route: Routes.CONNECT_SUCCESS, showAllWallets: false });
    } else {
      setRoute({ route: Routes.ONBOARDING, showAllWallets: false });
    }
  }, [value.isAuthenticated, value.isConnecting, value.signTx.openModal, value.connectSuccess]);

  const setModalRoute = (newRoute: ModalRoute) => {
    setRoute(newRoute);
  };

  const goBack = () => {
    setRoute((prev) => {
      if (prev.route === Routes.CONNECTING) {
        return { ...prev, route: Routes.ONBOARDING };
      } else if (prev.showAllWallets) {
        return { ...prev, showAllWallets: false };
      }
      return prev;
    });
  };

  const setShowAllWallets = (show: boolean) => {
    setRoute((prev) => ({ ...prev, showAllWallets: show }));
  };

  return (
    <ModalContext.Provider value={{ route, setModalRoute, goBack, setShowAllWallets }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
