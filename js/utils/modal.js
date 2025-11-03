/**
 * Vanilla JS Modal/Dialog implementation
 * Replaces React Dialog component
 */

export class Modal {
  constructor(options = {}) {
    this.options = {
      closeOnBackdrop: true,
      closeOnEscape: true,
      ...options
    };
    this.isOpen = false;
    this.onCloseCallback = null;
  }
  
  /**
   * Create modal structure
   */
  create(content) {
    // Remove existing modal if any
    this.destroy();
    
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;
    
    // Create modal container
    this.container = document.createElement('div');
    this.container.className = 'modal-container';
    this.container.style.cssText = `
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      transform: scale(0.95);
      transition: transform 0.2s ease;
    `;
    
    // Add content
    if (typeof content === 'string') {
      this.container.innerHTML = content;
    } else {
      this.container.appendChild(content);
    }
    
    // Create close button
    this.closeButton = document.createElement('button');
    this.closeButton.className = 'modal-close';
    this.closeButton.innerHTML = '×';
    this.closeButton.setAttribute('aria-label', 'Close');
    this.closeButton.style.cssText = `
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(8px);
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: white;
      font-size: 2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      transition: all 0.2s ease;
    `;
    
    this.closeButton.addEventListener('mouseenter', () => {
      this.closeButton.style.background = 'rgba(255, 255, 255, 0.35)';
    });
    
    this.closeButton.addEventListener('mouseleave', () => {
      this.closeButton.style.background = 'rgba(255, 255, 255, 0.25)';
    });
    
    // Assemble modal
    this.overlay.appendChild(this.container);
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.closeButton);
    
    // Event listeners
    this.setupEventListeners();
    
    return this;
  }
  
  setupEventListeners() {
    // Close button
    this.closeButton.addEventListener('click', () => this.close());
    
    // Backdrop click
    if (this.options.closeOnBackdrop) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
    
    // Escape key
    if (this.options.closeOnEscape) {
      this.handleEscape = (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      };
      document.addEventListener('keydown', this.handleEscape);
    }
  }
  
  /**
   * Open modal
   */
  open() {
    if (!this.overlay) return;
    
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
    
    // Trigger animations
    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
      this.container.style.transform = 'scale(1)';
    });
  }
  
  /**
   * Close modal
   */
  close() {
    if (!this.overlay || !this.isOpen) return;
    
    this.isOpen = false;
    this.overlay.style.opacity = '0';
    this.container.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      this.destroy();
      document.body.style.overflow = '';
      if (this.onCloseCallback) {
        this.onCloseCallback();
      }
    }, 200);
  }
  
  /**
   * Destroy modal
   */
  destroy() {
    if (this.handleEscape) {
      document.removeEventListener('keydown', this.handleEscape);
    }
    
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    
    if (this.closeButton && this.closeButton.parentNode) {
      this.closeButton.parentNode.removeChild(this.closeButton);
    }
    
    this.overlay = null;
    this.container = null;
    this.closeButton = null;
  }
  
  /**
   * Set onClose callback
   */
  onClose(callback) {
    this.onCloseCallback = callback;
    return this;
  }
}

/**
 * Simple modal helper function
 */
export function createModal(content, options) {
  const modal = new Modal(options);
  modal.create(content);
  return modal;
}

