import { useProvider } from "../context/provider";

const useSwitchNetwork = () => {
  const context = useProvider();

  if (!context) {
    throw new Error('useBlux must be used within a ProviderContext.');
  }

  const { value, setValue } = context;

  const switchNetwork = (newNetwork: string) => {
    if (!value.config.networks.includes(newNetwork)) {
      throw new Error('New network must be defined in config.networks');
    }

    setValue({
      ...value,
      activeNetwork: newNetwork,
    });
  };

  return {
    switchNetwork,
    networks: value.config.networks,
  }
};

export default useSwitchNetwork;

