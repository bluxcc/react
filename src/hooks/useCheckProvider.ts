import { useProvider } from "../context/provider";

const useCheckProvider = () => {
  const context = useProvider();

  if (!context) {
    throw new Error('Blux hooks must be used within a BluxProvider context.');
  }

  return context;
};

export default useCheckProvider;

