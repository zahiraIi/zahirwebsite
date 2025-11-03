/**
 * Initialize Projects Section
 */

import { createProjectsSection } from '../components/ProjectsSection.js';

export function initProjectsSection() {
  const container = document.getElementById('projects-section');
  if (!container) return;

  const section = createProjectsSection();
  container.appendChild(section);
}

