/**
 * Initialize Friends Section
 */

import { createFriendsSection } from '../components/FriendsSection.js';
import { friendsImages } from '../data/images.js';

export function initFriendsSection() {
  const container = document.getElementById('friends-section');
  if (!container) return;

  const section = createFriendsSection(friendsImages);
  container.appendChild(section);
}

