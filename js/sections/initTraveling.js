/**
 * Initialize Traveling Section
 */

import { createTravelingSection } from '../components/TravelingSection.js';
import { photoGalleryImages } from '../data/images.js';

export function initTravelingSection() {
  const container = document.getElementById('traveling-section');
  if (!container) return;

  const section = createTravelingSection(photoGalleryImages);
  container.appendChild(section);
}

