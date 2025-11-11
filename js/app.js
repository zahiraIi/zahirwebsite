/**
 * Main application initialization
 * Coordinates all app startup logic
 */

import { APP_CONFIG } from './config/app.js';
import { initFractalNoiseShader } from './components/FractalNoiseShader.js';
import { initDecryptedText } from './components/DecryptedText.js';
import { initHoverLinkPreview } from './components/HoverLinkPreview.js';
import { initScrollAnimations } from './utils/animations.js';
import { initAllSections } from './sections/index.js';

/**
 * Initialize visual effects
 */
function initVisualEffects() {
  // Fractal Noise Shader background
  initFractalNoiseShader(APP_CONFIG.fractalNoiseShader);
  
  // Decrypted text animation (desktop)
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
  
  // Decrypted text animation (mobile)
  initDecryptedText(
    'decrypted-name-mobile',
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

