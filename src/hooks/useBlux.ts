import { blux } from '../../../core/dist/index.esm.js';

export const useBlux = () => {
  const login = () => {
    blux.login();
  };

  const logout = () => {
    blux.logout();
  };

  const profile = () => {
    blux.profile();
  };

  const signMessage = (xdr: string, options?: { network: string }) => {
    return blux.signMessage(xdr, options);
  };

  const sendTransaction = (xdr: string, options?: { network: string }) => {
    return blux.sendTransaction(xdr, options);
  };

  return {
    login,
    logout,
    profile,
    signMessage,
    sendTransaction,
    user: blux.user,
    isReady: blux.isReady,
    isAuthenticated: blux.isAuthenticated,
  };
};
