import { useEffect } from 'react';
import { SupportedFonts } from '../types';
import { useBluxProvider } from './useBluxProvider';

// Google Fonts only supports these
const googleFonts: Record<SupportedFonts, string | null> = {
  Manrope: 'Manrope',
  Inter: 'Inter',
  'JetBrains Mono': 'JetBrains+Mono',
  Lora: 'Lora',
};

export function useGoogleFonts() {
  const context = useBluxProvider();
  const selectedFont = context.value?.appearance?.font as SupportedFonts;

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
