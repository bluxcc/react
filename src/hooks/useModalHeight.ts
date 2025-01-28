import { useState, useRef, useEffect } from 'react';

export const useModalHeight = (
  isOpen: boolean,
  initialHeight: number,
  children: React.ReactNode,
) => {
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [heightChanged, setHeightChanged] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const previousChildrenRef = useRef(children);
  const previousHeightRef = useRef<number>(initialHeight);

  useEffect(() => {
    if (!isOpen) {
      setContentHeight(null);
      setHeightChanged(false);
      isFirstRender.current = true;
      previousChildrenRef.current = children;
      previousHeightRef.current = initialHeight;
      return;
    }
  }, [isOpen, initialHeight, children]);

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const updateHeight = () => {
      const newHeight = contentRef.current?.offsetHeight;
      if (!newHeight) return;

      if (isFirstRender.current) {
        previousHeightRef.current = newHeight;
        isFirstRender.current = false;
        return;
      }

      if (newHeight !== previousHeightRef.current) {
        setContentHeight(newHeight);
        setHeightChanged(true);
        previousHeightRef.current = newHeight;
      }
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(contentRef.current);
    updateHeight();

    return () => resizeObserver.disconnect();
  }, [isOpen, children]);

  const currentHeight = isFirstRender.current
    ? initialHeight
    : contentHeight ?? previousHeightRef.current;

  return { contentRef, currentHeight, heightChanged };
};
