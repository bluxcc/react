import { IExplorers } from '../../types';
import EXPLORERS from '../../constants/explorers';

const getExplorerUrl = (
  networkPassphrase: string,
  explorerProvider: IExplorers,
  endpoint: 'accountUrl' | 'transactionUrl' | 'operationUrl' | 'ledgerUrl',
  value: string,
): string | null => {
  let explorer = EXPLORERS[explorerProvider];

  if (!explorer) {
    explorer = EXPLORERS.stellarchain;
  }

  let networkExplorer = explorer[networkPassphrase];

  if (!networkExplorer) {
    return null;
  }

  return `${networkExplorer}/${explorer[endpoint]}/${value}`;
};

export default getExplorerUrl;
