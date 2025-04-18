import { useEffect, useState } from "react";
import { Horizon, rpc } from "@stellar/stellar-sdk";

import { ContextInterface } from "../types";
import useCheckProvider from "./useCheckProvider";
import getNetworkRpc from "../utils/network/getNetworkRpc";

const getCustomNetworkDetails = (value: ContextInterface, network?: string) => {
  if (!network) {
    return {
      soroban: value.servers.soroban,
      horizon: value.servers.horizon,
      networkPassphrase: value.activeNetwork,
    };
  }

  const { horizon, soroban } = getNetworkRpc(network, value.config.transports ?? {});

  return {
    networkPassphrase: network,
    soroban: new rpc.Server(soroban.url),
    horizon: new Horizon.Server(horizon.url),
  };
};

const useCustomNetwork = (network?: string) => {
  const { value } = useCheckProvider();

  const [networkDetails, setNetworkDetails] = useState(getCustomNetworkDetails(value, network));
  
  useEffect(() => {
    setNetworkDetails(getCustomNetworkDetails(value, network || value.activeNetwork));
  }, [network, value.activeNetwork]);

  return networkDetails;
};

export default useCustomNetwork;
