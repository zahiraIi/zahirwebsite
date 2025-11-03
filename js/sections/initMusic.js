/**
 * Initialize Music Section
 */

import { createMusicSection } from '../components/MusicSection.js';
import { musicLibraryImages } from '../data/images.js';

export function initMusicSection() {
  const container = document.getElementById('music-section');
  if (!container) return;

  const section = createMusicSection(musicLibraryImages);
  container.appendChild(section);
}

