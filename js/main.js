/**
 * Main entry point
 * Pure vanilla JavaScript - no build step required
 */

import { domReady } from './core/dom.js';
import { initApp } from './app.js';

// Initialize application when DOM is ready
domReady(() => {
  initApp();
});

