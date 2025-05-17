import { networks } from '../../networks';

const getActiveNetworkTitle = (activeNetwork: string): string => {
  const networksArray = Object.entries(networks);
  const selectedNetwork = networksArray.find((n) => n[1] === activeNetwork);

  let networkName = '';

  if (!selectedNetwork) {
    networkName = 'MAINNET';
  } else {
    networkName = selectedNetwork[0].toUpperCase();
  }

  return networkName;
};

export default getActiveNetworkTitle;
