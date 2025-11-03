/**
 * ProjectsSection component - Vanilla JS
 */

import { projects } from '../data/projects.js';
import { createProjectCard } from './ProjectDialog.js';

export function createProjectsSection() {
  const section = document.createElement('section');
  section.className = 'relative py-12 md:py-16 lg:py-20 overflow-visible';
  section.style.minHeight = '80vh';
  
  const wrapper = document.createElement('div');
  wrapper.className = 'w-full pb-8';
  
  const card = document.createElement('div');
  card.className = 'rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md md:backdrop-blur-lg shadow-xl px-4 md:px-6 lg:px-8 py-6 md:py-8';
  
  const content = document.createElement('div');
  content.className = 'relative w-full fade-in-up';
  
  const title = document.createElement('h2');
  title.className = 'text-4xl md:text-6xl lg:text-7xl font-bold mb-8 md:mb-10 text-white fade-in-up section-title-mobile-center';
  title.textContent = 'Projects';
  title.dataset.delay = '100';
  
  const projectsContainer = document.createElement('div');
  projectsContainer.className = 'space-y-10';
  
  projects.forEach((project, index) => {
    const projectElement = createProjectCard(project, 0.2 + index * 0.1);
    projectsContainer.appendChild(projectElement);
  });
  
  content.appendChild(title);
  content.appendChild(projectsContainer);
  
  card.appendChild(content);
  wrapper.appendChild(card);
  section.appendChild(wrapper);
  
  return section;
}

