/**
 * Contact Form Component
 * Handles email form submission via Gmail API
 */

import { Modal } from '../utils/modal.js';

/**
 * Create and initialize contact form
 * @param {Object} options - Configuration options
 * @param {string} options.email - Recipient email address
 * @returns {Function} Function to open the contact form
 */
export function initContactForm(options = {}) {
  const { email = 'z5ali@ucsd.edu' } = options;
  
  let modal = null;
  
  /**
   * Create form HTML
   */
  function createFormHTML() {
    return `
      <style>
        .contact-form-container input::placeholder,
        .contact-form-container textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .contact-form-container input,
        .contact-form-container textarea {
          color: white;
        }
        .contact-form-container input:focus,
        .contact-form-container textarea:focus {
          outline: none;
        }
      </style>
      <div class="contact-form-container" style="
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 1rem;
        padding: 2rem;
        max-width: 600px;
        width: 90vw;
        color: white;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      ">
        <h2 style="
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
        ">Get in Touch</h2>
        <p style="
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
          font-size: 1rem;
        ">Send me a message and I'll get back to you as soon as possible :)</p>
        
        <form id="contact-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div>
            <label for="contact-name" style="
              display: block;
              margin-bottom: 0.5rem;
              color: rgba(255, 255, 255, 0.9);
              font-weight: 500;
            ">Name *</label>
            <input
              type="text"
              id="contact-name"
              name="name"
              placeholder="Your name"
              required
              style="
                width: 100%;
                padding: 0.75rem 1rem;
                background: rgba(255, 255, 255, 0.08);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 0.5rem;
                color: white;
                font-size: 1rem;
                transition: all 0.2s ease;
                box-sizing: border-box;
              "
              onfocus="this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.background='rgba(255, 255, 255, 0.12)'"
              onblur="this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.background='rgba(255, 255, 255, 0.08)'"
            />
          </div>
          
          <div>
            <label for="contact-email" style="
              display: block;
              margin-bottom: 0.5rem;
              color: rgba(255, 255, 255, 0.9);
              font-weight: 500;
            ">Email *</label>
            <input
              type="email"
              id="contact-email"
              name="email"
              placeholder="your.email@example.com"
              required
              style="
                width: 100%;
                padding: 0.75rem 1rem;
                background: rgba(255, 255, 255, 0.08);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 0.5rem;
                color: white;
                font-size: 1rem;
                transition: all 0.2s ease;
                box-sizing: border-box;
              "
              onfocus="this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.background='rgba(255, 255, 255, 0.12)'"
              onblur="this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.background='rgba(255, 255, 255, 0.08)'"
            />
          </div>
          
          <div>
            <label for="contact-message" style="
              display: block;
              margin-bottom: 0.5rem;
              color: rgba(255, 255, 255, 0.9);
              font-weight: 500;
            ">Message *</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Your message..."
              rows="6"
              required
              style="
                width: 100%;
                padding: 0.75rem 1rem;
                background: rgba(255, 255, 255, 0.08);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 0.5rem;
                color: white;
                font-size: 1rem;
                font-family: inherit;
                resize: vertical;
                transition: all 0.2s ease;
                box-sizing: border-box;
              "
              onfocus="this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.background='rgba(255, 255, 255, 0.12)'"
              onblur="this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.background='rgba(255, 255, 255, 0.08)'"
            ></textarea>
          </div>
          
          <div id="contact-form-status" style="
            padding: 1rem;
            border-radius: 0.5rem;
            display: none;
            margin-top: 0.5rem;
          "></div>
          
          <button
            type="submit"
            id="contact-submit-btn"
            style="
              padding: 0.875rem 2rem;
              background: rgba(255, 255, 255, 0.15);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.3);
              border-radius: 0.5rem;
              color: white;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              align-self: flex-start;
            "
            onmouseenter="this.style.background='rgba(255, 255, 255, 0.25)'; this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.transform='translateY(-2px)'"
            onmouseleave="this.style.background='rgba(255, 255, 255, 0.15)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(0)'"
          >
            <span id="submit-text">Send Message</span>
            <span id="submit-loading" style="display: none;">Sending...</span>
          </button>
        </form>
      </div>
    `;
  }
  
  /**
   * Handle form submission
   */
  function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById('contact-submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');
    const statusDiv = document.getElementById('contact-form-status');
    
    // Get form data
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: 'Contact Form Submission', // Default subject since we removed the field
      message: form.message.value.trim(),
      to: email
    };
    
    // Validate
    if (!formData.name || !formData.email || !formData.message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline';
    statusDiv.style.display = 'none';
    
    // Submit to API
    fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
      .then(async (response) => {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to send email');
        }
        
        // Success
        showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
        
        // Close modal after 2 seconds
        setTimeout(() => {
          if (modal) {
            modal.close();
          }
        }, 2000);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        showStatus(
          error.message || 'Failed to send message. Please try again or email me directly at ' + email,
          'error'
        );
      })
      .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
      });
  }
  
  /**
   * Show status message
   */
  function showStatus(message, type) {
    const statusDiv = document.getElementById('contact-form-status');
    statusDiv.style.display = 'block';
    statusDiv.style.padding = '1rem';
    statusDiv.style.borderRadius = '0.5rem';
    statusDiv.style.marginTop = '0.5rem';
    
    if (type === 'success') {
      statusDiv.style.background = 'rgba(34, 197, 94, 0.2)';
      statusDiv.style.border = '1px solid rgba(34, 197, 94, 0.5)';
      statusDiv.style.color = '#86efac';
    } else {
      statusDiv.style.background = 'rgba(239, 68, 68, 0.2)';
      statusDiv.style.border = '1px solid rgba(239, 68, 68, 0.5)';
      statusDiv.style.color = '#fca5a5';
    }
    
    statusDiv.textContent = message;
  }
  
  /**
   * Open contact form
   */
  function openContactForm() {
    const formHTML = createFormHTML();
    modal = new Modal({
      closeOnBackdrop: true,
      closeOnEscape: true
    });
    
    modal.create(formHTML);
    modal.open();
    
    // Attach form handler after modal is created
    setTimeout(() => {
      const form = document.getElementById('contact-form');
      if (form) {
        form.addEventListener('submit', handleSubmit);
      }
    }, 100);
  }
  
  return openContactForm;
}

