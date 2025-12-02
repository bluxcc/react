import { useMemo } from "react";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { getBalances } from "@bluxcc/core";
import type {
  GetBalancesOptions,
  GetBalancesResult,
} from "@bluxcc/core/dist/exports/core/getBalances";
import { getAddress, getNetwork } from "../utils";

export function useBalances(
  options?: GetBalancesOptions,
  queryOptions?: UseQueryOptions<GetBalancesResult, Error>
): UseQueryResult<GetBalancesResult, Error> {

  const address = getAddress(options?.address);
  const network = getNetwork(options?.network);
  
  const enabled = !!address && (queryOptions?.enabled ?? true);

  const queryKey = useMemo(
    () => [
      "blux",
      "balances",
      address ?? null,
      network ?? null,
      Boolean(options?.includeZeroBalances),
    ],
    [address, network, options?.includeZeroBalances]
  );

  const queryFn = useMemo(
    () => async () => {
      const opts: GetBalancesOptions = {
        address: options?.address,
        network: options?.network,
        includeZeroBalances: options?.includeZeroBalances,
      };
      return getBalances(opts);
    },
    [options?.address, options?.network, options?.includeZeroBalances]
  );

  const result = useQuery<GetBalancesResult, Error>({
    queryKey,
    queryFn,
    enabled,
    ...queryOptions,
  });

  return result;
}

export default useBalances;
