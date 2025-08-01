import { useEffect, useState } from 'react';

export const useDynamicHeight = (
  ref: React.RefObject<HTMLDivElement | null>,
  deps: React.DependencyList = [],
) => {
  const [height, setHeight] = useState<string | number>('auto');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateHeight = () => {
      setHeight(el.offsetHeight);
    };

    updateHeight();
    setReady(true);

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);

    return () => observer.disconnect();
  }, deps);

  return { height, ready };
};
