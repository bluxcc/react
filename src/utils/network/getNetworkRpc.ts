import { url } from "./url";
import { ITransports } from "../../types";
import NETWORKS_DETAILS, { NetworkDetails } from "../../constants/networkDetails";

const getNetworkRpc = (network: string, transports: ITransports): NetworkDetails => {
  let details = NETWORKS_DETAILS[network];

  const transport = transports[network];

  if (!details && !transport) {
    throw new Error('Custom network has no transports.');
  } else if (!details && transport) {
    details = {
      name: 'Custom Network',
      horizon: url(''),
      soroban: url(''),
    }
  }

  if (transport) {
    if (transport.horizon) {
      details.horizon = transport.horizon;
    }

    if (transport.soroban) {
      details.soroban = transport.soroban;
    }
  }

  return details;
};

export default getNetworkRpc;

