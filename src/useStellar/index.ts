import { core } from '@bluxcc/core';

import useAccount from './useAccount';
import useAccounts from './useAccounts';
import useAssets from './useAssets';
import useBalances from './useBalances';
import useClaimableBalances from './useClaimableBalances';
import useEffects from './useEffects';
import useLedgers from './useLedgers';
import useLiquidityPools from './useLiquidityPools';
import useNetwork from './useNetwork';
import useOffers from './useOffers';
import useOperations from './useOperations';
import useOrderbook from './useOrderbook';
import usePayments from './usePayments';
import useStrictReceivePaths from './useStrictReceivePaths';
import useStrictSendPaths from './useStrictSendPaths';
import useTradeAggregation from './useTradeAggregation';
import useTrades from './useTrades';
import useTransactions from './useTransactions';
import useSwitchNetwork from './useSwitchNetwork';

const coreExports = {
  networks: core.networks,
  useAccount,
  useAccounts,
  useAssets,
  useBalances,
  useClaimableBalances,
  useEffects,
  useLedgers,
  useLiquidityPools,
  useNetwork,
  useOffers,
  useOperations,
  useOrderbook,
  usePayments,
  useStrictReceivePaths,
  useStrictSendPaths,
  useTradeAggregation,
  useTrades,
  useTransactions,
  useSwitchNetwork,
};

export default coreExports;
