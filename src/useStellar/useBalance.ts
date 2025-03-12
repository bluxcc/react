import { useProvider } from '../context/provider';

type UseBalanceParameters = {
  address: string;
  blockNumber?: number;
  chainId?: number;
  enabled?: boolean;
}

const useBalance = (_params: UseBalanceParameters) => {
  const provider = useProvider()

  console.log(provider.value.config.network)
  
  return 2;
};

export default useBalance;
