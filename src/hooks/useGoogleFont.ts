import { useEffect } from 'react';
import { SupportedFonts } from '../types';
import { useProvider } from '../context/provider';

const googleFonts: Record<SupportedFonts, string | null> = {
  Lora: 'Lora',
  Inter: 'Inter',
  Manrope: 'Manrope',
  'JetBrains Mono': 'JetBrains+Mono',
};

export function useGoogleFonts() {
  const context = useProvider();
  const selectedFont = context.value?.config.appearance?.font as SupportedFonts;

  useEffect(() => {
    if (selectedFont && googleFonts[selectedFont]) {
      const encodedFont = googleFonts[selectedFont];
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${encodedFont}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [selectedFont]);

  return selectedFont;
}
