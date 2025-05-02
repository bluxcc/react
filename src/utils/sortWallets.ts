import { CheckedWallet } from '../types';
import { getRecentConnectionMethod } from './setRecentConnectionMethod';

const getSortedCheckedWallets = (wallets: CheckedWallet[]): CheckedWallet[] => {
  const recentNames = getRecentConnectionMethod();

  const walletMap = new Map(wallets.map((w) => [w.wallet.name, w]));
  const recentWallets: CheckedWallet[] = [];
  const seen = new Set<string>();

  for (const name of recentNames) {
    const wallet = walletMap.get(name);
    if (wallet) {
      recentWallets.push(wallet);
      seen.add(name);
    }
  }

  const remainingWallets = wallets.filter((w) => !seen.has(w.wallet.name));

  const result = [...recentWallets, ...remainingWallets];

  const walletsWithIsRecent = result.map((w, i) => {
    return {
      ...w,
      isRecent: i === 0,
    };
  });

  return walletsWithIsRecent;
};

export default getSortedCheckedWallets;
