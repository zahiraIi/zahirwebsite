/**
 * FriendsSection component - Vanilla JS
 */

import { createMusicGallery } from './MusicGallery.js';

export function createFriendsSection(images) {
  const section = document.createElement('section');
  section.className = 'relative flex items-center justify-center py-12 md:py-16 lg:py-20 overflow-hidden';
  
  const wrapper = document.createElement('div');
  wrapper.className = 'w-full px-4 md:px-6 lg:px-8';
  
  const content = document.createElement('div');
  content.className = 'relative w-full fade-in-up';
  
  const title = document.createElement('h2');
  title.className = 'text-4xl md:text-6xl lg:text-7xl font-bold mb-12 md:mb-16 text-white text-center fade-in-up';
  title.textContent = 'Gallery';
  title.dataset.delay = '100';
  
  const galleryContainer = document.createElement('div');
  galleryContainer.style.cssText = 'content-visibility: auto; contain-intrinsic-size: auto 1200px;';
  
  const gallery = createMusicGallery(images, {
    sizeVariant: 'normal'
  });
  
  galleryContainer.appendChild(gallery);
  
  content.appendChild(title);
  content.appendChild(galleryContainer);
  
  wrapper.appendChild(content);
  section.appendChild(wrapper);
  
  return section;
}

