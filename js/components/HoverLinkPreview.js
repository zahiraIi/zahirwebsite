/**
 * HoverLinkPreview component - Vanilla JS port
 * Shows image preview on link hover
 */

export function initHoverLinkPreview() {
  const links = document.querySelectorAll('.hover-link-preview[data-preview-image]');
  
  links.forEach(link => {
    let preview = null;
    let showPreview = false;
    
    const previewImage = link.dataset.previewImage;
    const previewAlt = link.dataset.previewAlt || 'Link preview';
    
    const createPreview = () => {
      if (preview) return;
      
      preview = document.createElement('div');
      preview.className = 'hover-link-preview-preview';
      
      const img = document.createElement('img');
      img.src = previewImage;
      img.alt = previewAlt;
      img.draggable = false;
      
      preview.appendChild(img);
      document.body.appendChild(preview);
    };
    
    const updatePreviewPosition = (e) => {
      if (!preview || !showPreview) return;
      
      const rect = link.getBoundingClientRect();
      const PREVIEW_WIDTH = 250;
      const PREVIEW_HEIGHT = 140;
      const OFFSET_Y = -40;
      
      const elementCenterX = rect.left + rect.width / 2;
      const top = rect.top - PREVIEW_HEIGHT - OFFSET_Y;
      const left = elementCenterX - PREVIEW_WIDTH / 2;
      
      preview.style.top = `${top}px`;
      preview.style.left = `${left}px`;
      
      // Calculate tilt based on horizontal movement
      if (link.prevX !== undefined) {
        const deltaX = e.clientX - link.prevX;
        const rotate = Math.max(-8, Math.min(8, deltaX * 0.8));
        preview.style.transform = `scale(1) translateY(0) rotate(${rotate}deg)`;
      }
      
      link.prevX = e.clientX;
    };
    
    link.addEventListener('mouseenter', () => {
      createPreview();
      showPreview = true;
      link.prevX = null;
      requestAnimationFrame(() => {
        if (preview) {
          preview.classList.add('visible');
        }
      });
    });
    
    link.addEventListener('mouseleave', () => {
      showPreview = false;
      link.prevX = null;
      if (preview) {
        preview.classList.remove('visible');
        preview.style.transform = 'scale(0.8) translateY(-10px) rotate(0deg)';
      }
    });
    
    link.addEventListener('mousemove', (e) => {
      updatePreviewPosition(e);
    });
  });
}

