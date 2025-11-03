/**
 * Initialize all sections
 */

import { initAboutSection } from './initAbout.js';
import { initProjectsSection } from './initProjects.js';
import { initTravelingSection } from './initTraveling.js';
import { initMusicSection } from './initMusic.js';
import { initFriendsSection } from './initFriends.js';

export function initAllSections() {
  initAboutSection();
  initProjectsSection();
  initTravelingSection();
  initMusicSection();
  initFriendsSection();
}

