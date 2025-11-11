/**
 * Application configuration
 * Centralized config for the entire site
 */

export const APP_CONFIG = {
  // Decrypted text animation
  decryptedText: {
    elementId: 'decrypted-name',
    text: 'Zahir Ali',
    speed: 80,
    maxIterations: 12,
    sequential: true,
    revealDirection: 'start',
    animateOn: 'view'
  },

  // Animation settings
  animations: {
    fadeInDuration: 1200,
    staggerDelay: 100,
    scrollThreshold: 0.1,
    scrollRootMargin: '0px'
  },

  // Gallery settings
  gallery: {
    initialVisibleCount: 6,
    loadDelay: 300,
    staggerDelay: 30
  },

  // Social links
  socialLinks: [
    {
      href: 'mailto:z5ali@ucsd.edu',
      label: 'Email',
      icon: 'mail'
    },
    {
      href: 'https://www.linkedin.com/in/zahir-a1i/',
      label: 'LinkedIn',
      icon: 'linkedin'
    },
    {
      href: 'https://github.com/zahiraIi',
      label: 'GitHub',
      icon: 'github'
    }
  ]
};

