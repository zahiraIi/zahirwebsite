/**
 * Animation utilities using Intersection Observer and CSS
 * Replaces Framer Motion animations
 */

/**
 * Initialize scroll-triggered animations for elements with fade-in-up class
 */
export function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in, .slide-up');
  
  if (animatedElements.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
          element.classList.add('visible');
        }, delay);
        
        observer.unobserve(element);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Create a fade-in animation
 */
export function fadeIn(element, duration = 300, delay = 0) {
  element.style.transition = `opacity ${duration}ms ease-out`;
  element.style.opacity = '0';
  
  setTimeout(() => {
    element.style.opacity = '1';
  }, delay);
}

/**
 * Create a slide-up animation
 */
export function slideUp(element, duration = 500, delay = 0) {
  element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
  element.style.transform = 'translateY(30px)';
  element.style.opacity = '0';
  
  setTimeout(() => {
    element.style.transform = 'translateY(0)';
    element.style.opacity = '1';
  }, delay);
}

/**
 * Animate element when it enters viewport
 */
export function animateOnScroll(element, animationFn, options = {}) {
  const { threshold = 0.1, once = true } = options;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animationFn(entry.target);
        if (once) {
          observer.unobserve(element);
        }
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold
  });
  
  observer.observe(element);
}

/**
 * Add stagger animation to multiple elements
 */
export function staggerAnimation(elements, animationFn, delay = 100) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      animationFn(element);
    }, index * delay);
  });
}

