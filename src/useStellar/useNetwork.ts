import { useEffect, useState } from "react";
import { useProvider } from "../context/provider";

const useNetwork = () => {
  const context = useProvider();
  const [network, setNetwork] = useState<null | string>(null);

  if (!context) {
    throw new Error('useBlux must be used within a ProviderContext.');
  }

  const { value } = context;

  useEffect(() => {
    setNetwork(value.activeNetwork);
  }, [value.activeNetwork]);

  return network;
};

export default useNetwork;

