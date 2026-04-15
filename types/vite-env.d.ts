/// <reference types="vite/client" />
declare const __IS_VITE_BUILD__: boolean;

interface Window {
  /** Set by main.ts so React can refresh WebGL after #globe is shown or reparented. */
  __portfolioGlobeResize?: () => void;
}
