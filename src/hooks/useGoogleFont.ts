import { useEffect, useState } from 'react';
import { SupportedFonts } from '../types';

export function useGoogleFonts() {
  const [selectedFont, setSelectedFont] = useState<SupportedFonts | null>(null);

  useEffect(() => {
    if (selectedFont) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(
        /\s+/g,
        '+',
      )}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [selectedFont]);

  return { selectedFont, setSelectedFont };
}
