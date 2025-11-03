/**
 * Initialize About Section
 */

import { createAboutSection } from '../components/AboutSection.js';

export function initAboutSection() {
  const container = document.getElementById('about-section');
  if (!container) return;

  const section = createAboutSection();
  container.appendChild(section);
}

