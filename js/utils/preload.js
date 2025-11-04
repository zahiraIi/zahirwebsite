/**
 * Resource Preloading Utilities
 * Preloads critical assets for faster initial page load
 * Based on modern web performance best practices
 */

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  // Preload critical CSS
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.as = 'style';
  criticalCSS.href = '/css/style.css';
  criticalCSS.onload = function() {
    this.onload = null;
    this.rel = 'stylesheet';
  };
  document.head.appendChild(criticalCSS);

  // Preload critical JavaScript modules (main entry point)
  const mainJS = document.createElement('link');
  mainJS.rel = 'modulepreload';
  mainJS.href = '/js/main.js';
  document.head.appendChild(mainJS);

  // Preload critical images
  const profileImage = document.createElement('link');
  profileImage.rel = 'preload';
  profileImage.as = 'image';
  profileImage.href = '/attached_assets/zahir.webp';
  profileImage.fetchPriority = 'high';
  document.head.appendChild(profileImage);
}

/**
 * Preconnect to external domains
 */
export function preconnectExternalDomains() {
  const domains = [
    { href: 'https://cdn.jsdelivr.net', crossorigin: false }, // Three.js, OGL, p5.js
    { href: 'https://cdnjs.cloudflare.com', crossorigin: false }, // p5.js fallback
    { href: 'https://fonts.googleapis.com', crossorigin: false },
    { href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    { href: 'https://use.typekit.net', crossorigin: false }
  ];

  domains.forEach(({ href, crossorigin }) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    if (crossorigin) {
      link.crossOrigin = crossorigin;
    }
    document.head.appendChild(link);
  });
}

/**
 * DNS prefetch for external domains
 */
export function dnsPrefetchDomains() {
  const domains = [
    'https://atmosenseinc.com',
    'https://www.linkedin.com',
    'https://github.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}

/**
 * Initialize all preloading strategies
 */
export function initPreloading() {
  // Run immediately (before DOM ready for head-only resources)
  preconnectExternalDomains();
  dnsPrefetchDomains();
  
  // Preload critical resources after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalResources);
  } else {
    preloadCriticalResources();
  }
}

