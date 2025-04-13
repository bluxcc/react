import { useProvider } from "../context/provider";

const useSwitchNetwork = (networkPassphrase: string) => {
  const context = useProvider();

  if (!context) {
    throw new Error('useBlux must be used within a ProviderContext.');
  }

  const { value, setValue } = context;

  if (!value.config.networks.includes(networkPassphrase)) {
    throw new Error('New network must be defined in config.networks');
  }

  setValue({
    ...value,
    activeNetwork: networkPassphrase,
  });
};

export default useSwitchNetwork;

