// Create this file in your project and import it in your app's entry point
// This ensures Buffer is available before any module requires it

// If using ES modules
import { Buffer as BufferPolyfill } from 'buffer';

// Define Buffer globally if it doesn't exist
if (typeof globalThis.Buffer === 'undefined') {
  console.info('[Blux] Buffer polyfilled');
  globalThis.Buffer = BufferPolyfill;
}

export { BufferPolyfill };
