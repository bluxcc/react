import getNetworkByPassphrase from './getNetworkByPassphrase';

const getExplorerUrl = (
  networkPassphrase: string,
  endpoint: string,
): string => {
  const network = getNetworkByPassphrase(networkPassphrase);
  return `https://stellar.expert/explorer/${network}/${endpoint}`;
};

export default getExplorerUrl;
