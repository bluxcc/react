// import { useMemo, useState } from 'react';
// import { walletConfigs } from './walletsConfig';
// import { SupportedWallets } from '../types';

// export const useWallet = () => {
//   const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const walletsList = useMemo(
//     () =>
//       Object.entries(walletConfigs).map(([type, details]) => ({
//         type,
//         ...details,
//       })),
//     [],
//   );

//   const connectWallet = async (walletType: SupportedWallets) => {
//     setErrorMessage(null);
//     const wallet = walletConfigs[walletType];

//     try {
//       if (!(await wallet.isAvailable())) {
//         throw new Error(`${wallet.name} is not available.`);
//       }
//       const result = await wallet.connect();
//       setConnectedWallet(result.publicKey);
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
//     }
//   };

//   const signTransaction = async (
//     walletType: SupportedWallets,
//     xdr: string,
//     options?: {
//       networkPassphrase?: string;
//       address?: string;
//       submit?: boolean;
//     },
//   ) => {
//     const wallet = walletConfigs[walletType];
//     if (!wallet.signTransaction) {
//       throw new Error(`${wallet.name} does not support signing transactions.`);
//     }

//     try {
//       return await wallet.signTransaction(xdr, {
//         submit: options?.submit,
//         address: options?.address,
//         networkPassphrase: options?.networkPassphrase,
//       });
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
//       throw error;
//     }
//   };

//   return {
//     walletsList,
//     connectedWallet,
//     errorMessage,
//     connectWallet,
//     signTransaction,
//   };
// };
