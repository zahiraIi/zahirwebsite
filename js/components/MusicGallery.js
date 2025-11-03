/**
 * MusicGallery component - Vanilla JS port
 * Reusable gallery component for images with optional links and Google Earth integration
 */

export function createMusicGallery(images, options = {}) {
  const {
    sizeVariant = 'normal',
    enableLinks = false,
    enableGoogleEarth = false
  } = options;

  const container = document.createElement('div');
  container.className = 'relative w-full py-8 md:py-12';

  const grid = document.createElement('div');
  grid.className = 'mx-auto grid w-full max-w-[1400px] grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6 lg:px-8';
  grid.style.gridAutoRows = '1fr';

  let selectedImage = null;

  // Lightbox modal
  const createLightbox = () => {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const content = document.createElement('div');
    content.className = 'lightbox-content';
    content.style.cssText = `
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem;
      pointer-events: none;
    `;

    const counter = document.createElement('div');
    counter.className = 'text-white/50 text-xs md:text-sm font-light flex-shrink-0 mb-1';

    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
      flex: 1;
      width: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const img = document.createElement('img');
    img.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 0.5rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      opacity: 1;
      transition: opacity 0.3s ease-in-out;
    `;

    // Navigation state
    let disabled = false;
    
    // Navigation buttons
    const prevBtn = createNavButton('Previous', 'left', () => navigateImage(-1));
    const nextBtn = createNavButton('Next', 'right', () => navigateImage(1));
    const closeBtn = createCloseButton(() => closeLightbox());

    const navigateImage = (direction) => {
      if (!selectedImage || disabled) return;
      
      // Disable navigation during transition
      disabled = true;
      prevBtn.classList.add('disabled');
      nextBtn.classList.add('disabled');
      
      const currentIndex = images.findIndex(img => {
        const imgUrl = img.fullSizeUrl || img.url;
        return imgUrl === selectedImage.url;
      });
      const newIndex = (currentIndex + direction + images.length) % images.length;
      const newImage = images[newIndex];
      selectedImage = {
        url: newImage.fullSizeUrl || newImage.url,
        title: newImage.title,
        location: newImage.location,
        index: newIndex
      };
      updateLightbox();
      
      // Re-enable after transition
      setTimeout(() => {
        disabled = false;
        prevBtn.classList.remove('disabled');
        nextBtn.classList.remove('disabled');
      }, 300);
    };

    const updateLightbox = () => {
      if (!selectedImage) return;
      // Add fade transition for smooth image changes
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in-out';
      
      setTimeout(() => {
        img.src = selectedImage.url;
        img.alt = selectedImage.title;
        counter.textContent = `${selectedImage.index + 1} / ${images.length}`;
        
        // Update Google Earth button if location exists
        earthBtnContainer.innerHTML = '';
        if (enableGoogleEarth && selectedImage?.location) {
          const earthBtn = createGoogleEarthButton(selectedImage.location);
          earthBtnContainer.appendChild(earthBtn);
        }
        
        // Fade in new image
        requestAnimationFrame(() => {
          img.style.opacity = '1';
        });
      }, 150);
    };

    const closeLightbox = () => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        document.body.style.overflow = '';
      }, 200);
      selectedImage = null;
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (!selectedImage || disabled) return;
      if (e.key === 'ArrowLeft') navigateImage(-1);
      if (e.key === 'ArrowRight') navigateImage(1);
      if (e.key === 'Escape') closeLightbox();
    };
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;
    
    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;
      
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swipe left - next image
          navigateImage(1);
        } else {
          // Swipe right - previous image
          navigateImage(-1);
        }
      }
    };
    
    content.addEventListener('touchstart', handleTouchStart, { passive: true });
    content.addEventListener('touchend', handleTouchEnd, { passive: true });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });

    content.addEventListener('click', (e) => e.stopPropagation());

    // Google Earth button container (will be updated dynamically)
    const earthBtnContainer = document.createElement('div');
    earthBtnContainer.className = 'earth-btn-container';
    
    content.appendChild(counter);
    content.appendChild(imageContainer);
    imageContainer.appendChild(img);
    content.appendChild(earthBtnContainer);

    overlay.appendChild(content);
    overlay.appendChild(prevBtn);
    overlay.appendChild(nextBtn);
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Show with animation
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    document.addEventListener('keydown', handleKeyDown);
    overlay.dataset.keyboardHandler = 'true';

    // Initialize with first image (will also create Google Earth button if needed)
    updateLightbox();
  };

  const createNavButton = (label, position, onClick) => {
    // Create wrapper div for glass button effect
    const wrapper = document.createElement('div');
    wrapper.className = 'glass-button-wrap';
    wrapper.style.cssText = `
      position: fixed;
      ${position === 'left' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
      top: 50%;
      transform: translateY(-50%);
      width: 2.5rem;
      height: 2.5rem;
      z-index: 10003;
      pointer-events: auto;
      touch-action: none;
    `;
    
    // Responsive sizing for larger screens
    if (window.matchMedia && window.matchMedia('(min-width: 768px)').matches) {
      wrapper.style.width = '4rem';
      wrapper.style.height = '4rem';
      wrapper.style[position === 'left' ? 'left' : 'right'] = '1.5rem';
    }
    
    // Create shadow layer
    const shadow = document.createElement('div');
    shadow.className = 'glass-button-shadow';
    
    // Create button element
    const btn = document.createElement('button');
    btn.className = 'glass-button';
    btn.setAttribute('aria-label', label);
    btn.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      outline: none;
    `;
    
    // Create icon wrapper
    const iconWrapper = document.createElement('span');
    iconWrapper.className = 'glass-button-text';
    iconWrapper.style.cssText = `
      width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    if (window.matchMedia && window.matchMedia('(min-width: 768px)').matches) {
      iconWrapper.style.width = '2rem';
      iconWrapper.style.height = '2rem';
    }
    
    iconWrapper.innerHTML = position === 'left' 
      ? '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>'
      : '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>';
    
    btn.appendChild(iconWrapper);
    wrapper.appendChild(shadow);
    wrapper.appendChild(btn);
    
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!wrapper.classList.contains('disabled')) {
        onClick();
      }
    });
    
    // Store reference to wrapper for disabling
    wrapper._buttonElement = btn;
    
    return wrapper;
  };

  const createCloseButton = (onClick) => {
    // Create wrapper div for glass button effect
    const wrapper = document.createElement('div');
    wrapper.className = 'glass-button-wrap';
    wrapper.style.cssText = `
      position: fixed;
      top: 0.5rem;
      right: 0.5rem;
      width: 2.5rem;
      height: 2.5rem;
      z-index: 10003;
      pointer-events: auto;
      touch-action: none;
    `;
    
    // Responsive sizing for larger screens
    if (window.matchMedia && window.matchMedia('(min-width: 768px)').matches) {
      wrapper.style.width = '4rem';
      wrapper.style.height = '4rem';
      wrapper.style.top = '1.5rem';
      wrapper.style.right = '1.5rem';
    }
    
    // Create shadow layer
    const shadow = document.createElement('div');
    shadow.className = 'glass-button-shadow';
    
    // Create button element
    const btn = document.createElement('button');
    btn.className = 'glass-button';
    btn.setAttribute('aria-label', 'Close');
    btn.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      outline: none;
    `;
    
    // Create text wrapper
    const textWrapper = document.createElement('span');
    textWrapper.className = 'glass-button-text';
    textWrapper.style.cssText = `
      font-size: 1rem;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    `;
    
    // Responsive font size for larger screens
    if (window.matchMedia && window.matchMedia('(min-width: 768px)').matches) {
      textWrapper.style.fontSize = '1.25rem';
    }
    
    textWrapper.textContent = '×';
    
    btn.appendChild(textWrapper);
    wrapper.appendChild(shadow);
    wrapper.appendChild(btn);
    
    wrapper.addEventListener('click', onClick);
    
    return wrapper;
  };

  const createGoogleEarthButton = (location) => {
    // Create wrapper div for glass button effect
    const wrapper = document.createElement('div');
    wrapper.className = 'glass-button-wrap';
    wrapper.style.cssText = `
      display: inline-block;
      pointer-events: auto;
    `;
    
    // Create shadow layer
    const shadow = document.createElement('div');
    shadow.className = 'glass-button-shadow';
    
    // Create button element
    const btn = document.createElement('button');
    btn.className = 'glass-button';
    btn.setAttribute('aria-label', `Travel to ${location.name}`);
    btn.style.cssText = `
      color: white;
      font-size: 0.875rem;
      outline: none;
      width: 100%;
      height: 100%;
    `;
    
    // Create content wrapper
    const contentWrapper = document.createElement('span');
    contentWrapper.className = 'glass-button-text';
    contentWrapper.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
    `;
    
    const icon = document.createElement('span');
    icon.style.cssText = 'width: 1rem; height: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;';
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 100%; height: 100%;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    `;
    
    const text = document.createElement('span');
    text.textContent = `Travel to ${location.name}`;
    
    contentWrapper.appendChild(icon);
    contentWrapper.appendChild(text);
    btn.appendChild(contentWrapper);
    wrapper.appendChild(shadow);
    wrapper.appendChild(btn);
    
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      const url = location.url || `https://earth.google.com/web/@${location.lat},${location.lng},0a,1000d,35y,0h,0t,0r`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
    
    return wrapper;
  };

  // Create image cards - render all images for full gallery navigation
  images.forEach((image, index) => {
    const card = document.createElement('div');
    card.className = 'gallery-image-card';
    card.style.opacity = '0';
    
    const img = document.createElement('img');
    img.src = image.url;
    img.alt = image.title;
    img.loading = 'lazy';
    img.decoding = 'async';
    
    img.addEventListener('load', () => {
      card.style.opacity = '1';
    });

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          card.style.opacity = '1';
        }, index * 30);
        observer.disconnect();
      }
    }, {
      rootMargin: '200px',
      threshold: 0.01
    });

    observer.observe(card);

    card.appendChild(img);
    
    card.addEventListener('click', () => {
      if (enableLinks && image.link) {
        window.open(image.link, '_blank', 'noopener,noreferrer');
      } else {
        selectedImage = {
          url: image.fullSizeUrl || image.url,
          title: image.title,
          location: image.location,
          index: index
        };
        createLightbox();
      }
    });

    grid.appendChild(card);
  });

  container.appendChild(grid);
  return container;
}

