/**
 * Main application initialization
 * Coordinates all app startup logic
 */

import { APP_CONFIG } from './config/app.js';
import { initDarkVeil } from './components/DarkVeil.js';
import { initDecryptedText } from './components/DecryptedText.js';
import { initHoverLinkPreview } from './components/HoverLinkPreview.js';
import { initScrollAnimations } from './utils/animations.js';
import { initAllSections } from './sections/index.js';

/**
 * Initialize visual effects
 */
function initVisualEffects() {
  // DarkVeil background (deep blue/shooting star)
  // Use requestAnimationFrame to ensure DOM is fully laid out
  requestAnimationFrame(() => {
    initDarkVeil({
      containerId: 'fractal-noise-container',
      hueShift: 30, // Pure blue (shooting star blue)
      noiseIntensity: 0,
      scanlineIntensity: 0,
      speed: 0.6,
      scanlineFrequency: 0,
      warpAmount: 0,
      resolutionScale: 0.9,
      maxDevicePixelRatio: 1.1,
      adaptiveResolution: true,
      pauseWhenHidden: true
    });
  });
  
  // Decrypted text animation
  initDecryptedText(
    APP_CONFIG.decryptedText.elementId,
    APP_CONFIG.decryptedText.text,
    {
      speed: APP_CONFIG.decryptedText.speed,
      maxIterations: APP_CONFIG.decryptedText.maxIterations,
      sequential: APP_CONFIG.decryptedText.sequential,
      revealDirection: APP_CONFIG.decryptedText.revealDirection,
      animateOn: APP_CONFIG.decryptedText.animateOn
    }
  );
}

/**
 * Initialize UI components
 */
function initUIComponents() {
  initHoverLinkPreview();
}

/**
 * Initialize analytics
 */
function initAnalytics() {
  // Initialize Vercel Analytics
  import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/@vercel/analytics/dist/index.mjs')
    .then((module) => {
      if (module && typeof module.inject === 'function') {
        module.inject();
        console.log('Vercel Analytics initialized');
      } else {
        console.warn('Vercel Analytics: inject function not available');
      }
    })
    .catch((error) => {
      console.warn('Failed to initialize Vercel Analytics:', error);
    });
}

/**
 * Initialize application
 */
export function initApp() {
  console.log('Initializing application...');
  
  // Initialize analytics first (non-blocking)
  initAnalytics();
  
  // Initialize visual effects
  initVisualEffects();
  
  // Initialize UI components
  initUIComponents();
  
  // Initialize all sections
  initAllSections();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  console.log('Application initialized successfully!');
}

