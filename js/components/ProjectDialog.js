/**
 * ProjectDialog component - Vanilla JS
 * Creates project cards with modals for embeddable projects
 */

import { Modal } from '../utils/modal.js';

export function createProjectCard(project, delay = 0.2) {
  const {
    title,
    description,
    previewImage,
    logoImage,
    projectUrl,
    externalUrl,
    isEmbeddable = true
  } = project;

  const container = document.createElement('div');
  container.className = 'group fade-in-up';
  container.style.transitionDelay = `${delay * 1000}ms`;
  
  // Title with Logo
  const titleContainer = document.createElement('div');
  
  // All projects use left alignment (same as UCSD)
  titleContainer.className = 'mb-4 flex items-center gap-6 md:gap-8 project-title-container';
  
  if (logoImage) {
    const logoContainer = document.createElement('div');
    logoContainer.className = 'flex-shrink-0 flex items-center';
    
    const logo = document.createElement('img');
    // Normalize path - remove /public/ prefix if present
    const normalizedPath = logoImage.replace(/^\/public\//, '/');
    logo.src = normalizedPath;
    logo.alt = `${title} logo`;
    
    // Logo sizing: 3x larger than text height for better visibility
    // Title text scales: text-lg (1.125rem) -> md:text-2xl (1.5rem) -> lg:text-3xl (1.875rem)
    // Logo sizes: 3.375rem (base) -> 4.5rem (md) -> 5.625rem (lg)
    logo.className = 'project-logo';
    
    // Check if this is SJSU ASCE - use original rectangular/horizontal format
    const isSJSU = title && title.includes("SJSU");
    // Check if this is MTC/Theology logo - needs special centering
    const isMTC = title && (title.includes("Theology") || logoImage.includes("MTC"));
    
    if (isSJSU) {
      // SJSU ASCE: Use original horizontal/rectangular logo format (no border/box)
      logo.style.cssText = 'height: 3.375rem; max-width: 210px; object-fit: contain;';
      logo.style.setProperty('--logo-height-md', '4.5rem');
      logo.style.setProperty('--logo-height-lg', '5.625rem');
      logo.style.setProperty('--logo-max-width-md', '270px');
      logo.style.setProperty('--logo-max-width-lg', '300px');
    } else if (isMTC) {
      // MTC logo: Circular format with contain and centered positioning for even alignment
      const hasBorder = true;
      const borderStyle = 'border: 1px solid rgba(255, 255, 255, 0.2);';
      logo.style.cssText = `width: 3.375rem; height: 3.375rem; border-radius: 50%; background-color: #1a237e; ${borderStyle} object-fit: contain; object-position: center; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);`;
      logo.style.setProperty('--logo-size-md', '4.5rem');
      logo.style.setProperty('--logo-size-lg', '5.625rem');
    } else {
      // Other logos: Circular format matching UCSD style
      const hasBorder = true; // All circular logos have border
      const borderStyle = 'border: 1px solid rgba(255, 255, 255, 0.2);';
      logo.style.cssText = `width: 3.375rem; height: 3.375rem; border-radius: 50%; ${borderStyle} object-fit: cover; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);`;
      logo.style.setProperty('--logo-size-md', '4.5rem');
      logo.style.setProperty('--logo-size-lg', '5.625rem');
    }
    
    logoContainer.appendChild(logo);
    titleContainer.appendChild(logoContainer);
  }
  
  const titleDiv = document.createElement('div');
  
  // All projects use flex-1 for consistent left alignment
  titleDiv.className = 'flex-1 flex items-center project-title-div';
  titleDiv.style.alignSelf = 'stretch';
  
  if (externalUrl) {
    const titleLink = document.createElement('a');
    titleLink.href = externalUrl;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';
    titleLink.className = 'text-white font-light text-xl md:text-4xl hover:text-white/80 transition-colors project-title';
    titleLink.style.textShadow = '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)';
    titleLink.style.display = 'flex';
    titleLink.style.alignItems = 'center';
    titleLink.style.lineHeight = '1.2';
    titleLink.style.textDecoration = 'none';
    
    titleLink.textContent = title;
    titleDiv.appendChild(titleLink);
  } else {
    const titleSpan = document.createElement('span');
    titleSpan.className = 'text-white font-light text-xl md:text-4xl project-title';
    titleSpan.style.textShadow = '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)';
    titleSpan.style.display = 'flex';
    titleSpan.style.alignItems = 'center';
    titleSpan.style.lineHeight = '1.2';
    titleSpan.style.textDecoration = 'none';
    
    titleSpan.textContent = title;
    titleDiv.appendChild(titleSpan);
  }
  
  titleContainer.appendChild(titleDiv);
  container.appendChild(titleContainer);
  
  // Description
  const desc = document.createElement('p');
  desc.className = 'text-base md:text-lg lg:text-xl leading-relaxed text-white transition-colors duration-200 mb-6 section-content-mobile-center';
  desc.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
  desc.textContent = description;
  container.appendChild(desc);
  
  // Preview Image or Iframe
  if (!isEmbeddable || !projectUrl) {
    // Non-embeddable: show preview image with link
    const previewContainer = document.createElement('div');
    previewContainer.className = 'mt-6 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl project-preview-image cursor-pointer';
    
    const previewLink = document.createElement('a');
    previewLink.href = externalUrl;
    previewLink.target = '_blank';
    previewLink.rel = 'noopener noreferrer';
    previewLink.className = 'block relative group/image';
    
    const img = document.createElement('img');
    // Normalize path - remove /public/ prefix if present
    const normalizedPreviewPath = previewImage.replace(/^\/public\//, '/');
    img.src = normalizedPreviewPath;
    img.alt = title;
    img.className = 'w-full h-auto object-cover max-h-[600px]';
    img.loading = 'lazy';
    
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center';
    overlay.innerHTML = `
      <span class="text-white text-xl font-semibold px-6 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/50 flex items-center gap-2 shadow-2xl">
        View Project
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </span>
    `;
    
    previewLink.appendChild(img);
    previewLink.appendChild(overlay);
    previewContainer.appendChild(previewLink);
    container.appendChild(previewContainer);
  } else {
    // Embeddable: show iframe directly
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black/40';
    
    const iframeWrapper = document.createElement('div');
    iframeWrapper.className = 'project-iframe-wrapper';
    iframeWrapper.style.height = '400px';
    
    const iframe = document.createElement('iframe');
    iframe.src = projectUrl;
    iframe.className = 'project-iframe';
    iframe.title = title;
    iframe.loading = 'lazy';
    iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    
    iframeWrapper.appendChild(iframe);
    iframeContainer.appendChild(iframeWrapper);
    
    // External link indicator - skip for SJSU and Theology projects
    if (externalUrl && !title.includes("SJSU") && !title.includes("Theology")) {
      const externalLink = document.createElement('a');
      externalLink.href = externalUrl;
      externalLink.target = '_blank';
      externalLink.rel = 'noopener noreferrer';
      externalLink.className = 'text-white/60 hover:text-white transition-colors flex items-center gap-1 mt-2';
      // Reduce size by ~200% (make it much smaller, ~0.3x of original)
      externalLink.style.fontSize = '0.3rem';
      externalLink.style.textDecoration = 'none';
      externalLink.innerHTML = `
        Open in new tab
        <svg style="width: 0.3rem; height: 0.3rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      `;
      
      // Add link to the right of the title for all projects
      const titleWithLink = titleContainer.querySelector('.flex-1');
      if (titleWithLink) {
        titleWithLink.className += ' flex items-baseline justify-between flex-wrap gap-4';
        titleWithLink.appendChild(externalLink);
      }
    }
    
    container.appendChild(iframeContainer);
  }
  
  return container;
}

