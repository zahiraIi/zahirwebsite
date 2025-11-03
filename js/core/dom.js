/**
 * Core DOM manipulation utilities
 * Pure vanilla JS helpers for creating and manipulating elements
 */

/**
 * Create an element with attributes and children
 */
export function createElement(tag, options = {}) {
  const {
    className = '',
    id = '',
    text = '',
    html = '',
    style = {},
    attributes = {},
    children = [],
    events = {}
  } = options;

  const element = document.createElement(tag);

  if (className) element.className = className;
  if (id) element.id = id;
  if (text) element.textContent = text;
  if (html) element.innerHTML = html;

  // Apply inline styles
  Object.assign(element.style, style);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });

  // Attach event listeners
  Object.entries(events).forEach(([event, handler]) => {
    element.addEventListener(event, handler);
  });

  return element;
}

/**
 * Create a text node
 */
export function createText(text) {
  return document.createTextNode(text);
}

/**
 * Append multiple children to an element
 */
export function appendChildren(parent, ...children) {
  children.forEach(child => {
    if (child instanceof Node) {
      parent.appendChild(child);
    } else if (Array.isArray(child)) {
      appendChildren(parent, ...child);
    }
  });
  return parent;
}

/**
 * Set multiple attributes at once
 */
export function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

/**
 * Add multiple classes
 */
export function addClasses(element, ...classes) {
  classes.forEach(cls => {
    if (cls) element.classList.add(cls);
  });
  return element;
}

/**
 * Remove multiple classes
 */
export function removeClasses(element, ...classes) {
  classes.forEach(cls => element.classList.remove(cls));
  return element;
}

/**
 * Toggle classes
 */
export function toggleClasses(element, ...classes) {
  classes.forEach(cls => element.classList.toggle(cls));
  return element;
}

/**
 * Query selector with optional context
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query selector all with optional context
 */
export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Wait for DOM ready
 */
export function domReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Get or create element
 */
export function getOrCreate(selector, tag = 'div', parent = document.body) {
  let element = $(selector);
  if (!element) {
    element = createElement(tag, { id: selector.replace('#', '') });
    parent.appendChild(element);
  }
  return element;
}

