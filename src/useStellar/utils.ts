// import { getState } from '../../../core/dist/index.esm';
//
// export const checkConfigCreated = () => {
//   const { stellar } = getState();
//
//   return !!stellar;
// };
//
// export const getAddress = (address?: string) => {
//   const { user } = getState();
//
//   if (!user && !address) {
//     throw new Error('Address not found');
//   }
//
//   if (address) {
//     return address;
//   }
//
//   return user?.address as string;
// };
//
// export const getNetwork = (network?: string) => {
//   const { stellar } = getState();
//
//   if (!network) {
//     if (stellar) {
//       return stellar.activeNetwork;
//     }
//
//     throw new Error('Custom network has no transports.');
//   }
//
//   return network;
// };
