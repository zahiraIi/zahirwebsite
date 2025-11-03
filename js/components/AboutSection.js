/**
 * AboutSection component - Vanilla JS
 */

export function createAboutSection() {
  const section = document.createElement('section');
  section.className = 'relative py-12 md:py-16 lg:py-20 overflow-visible';
  
  const wrapper = document.createElement('div');
  wrapper.className = 'w-full pb-8';
  
  const card = document.createElement('div');
  card.className = 'rounded-2xl border border-white/0 bg-white/10 backdrop-blur-md md:backdrop-blur-lg shadow-xl px-4 md:px-6 lg:px-8 py-6 md:py-8';
  
  const title = document.createElement('h2');
  title.className = 'text-4xl md:text-6xl lg:text-7xl font-bold mb-8 md:mb-10 text-white fade-in-up';
  title.textContent = 'About Me';
  title.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
  
  const content = document.createElement('div');
  content.className = 'space-y-6 md:space-y-8 text-xl md:text-4xl font-light leading-relaxed';
  
  const paragraph1 = document.createElement('p');
  paragraph1.className = 'text-white fade-in-up';
  paragraph1.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
  paragraph1.dataset.delay = '200';
  
  const paragraph2 = document.createElement('p');
  paragraph2.className = 'text-white fade-in-up';
  paragraph2.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
  paragraph2.dataset.delay = '300';
  paragraph2.textContent = 'Sophomore at UC San Diego majoring in Cognitive Science specializing Machine Learning and Neural Computation. Built autonomous systems to natural language processing projects.';
  
  const paragraph3 = document.createElement('p');
  paragraph3.className = 'text-white fade-in-up';
  paragraph3.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
  paragraph3.dataset.delay = '400';
  paragraph3.textContent = 'I love traveling, spending time with friends and family, and tinkering on new side projects.';
  
  content.appendChild(paragraph1);
  content.appendChild(paragraph2);
  content.appendChild(paragraph3);
  
  card.appendChild(title);
  card.appendChild(content);
  wrapper.appendChild(card);
  section.appendChild(wrapper);
  
  return section;
}

