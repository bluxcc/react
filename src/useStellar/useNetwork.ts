import { useEffect, useState } from "react";

import { useProvider } from "../context/provider";

const useNetwork = () => {
  const context = useProvider();

  if (!context) {
    throw new Error('useBlux must be used within a ProviderContext.');
  }

  const { value } = context;

  const [network, setNetwork] = useState<string>(value.activeNetwork);

  useEffect(() => {
    setNetwork(value.activeNetwork);
  }, [value.activeNetwork]);

  return network;
};

export default useNetwork;

