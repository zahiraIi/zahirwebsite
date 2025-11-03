/**
 * Pre-built element factories
 * Common UI element creators
 */

import { createElement, appendChildren } from './dom.js';

/**
 * Create a button element
 */
export function createButton(options = {}) {
  const {
    text = '',
    className = '',
    onClick = null,
    type = 'button',
    ...rest
  } = options;

  return createElement('button', {
    className,
    text,
    attributes: { type },
    events: onClick ? { click: onClick } : {},
    ...rest
  });
}

/**
 * Create a link element
 */
export function createLink(options = {}) {
  const {
    href = '#',
    text = '',
    className = '',
    target = '',
    rel = '',
    ...rest
  } = options;

  const attributes = { href };
  if (target) attributes.target = target;
  if (rel) attributes.rel = rel;

  return createElement('a', {
    className,
    text,
    attributes,
    ...rest
  });
}

/**
 * Create an image element
 */
export function createImage(options = {}) {
  const {
    src = '',
    alt = '',
    className = '',
    loading = 'lazy',
    ...rest
  } = options;

  return createElement('img', {
    className,
    attributes: {
      src,
      alt,
      loading
    },
    ...rest
  });
}

/**
 * Create a heading element
 */
export function createHeading(level, options = {}) {
  const {
    text = '',
    className = '',
    ...rest
  } = options;

  return createElement(`h${level}`, {
    className,
    text,
    ...rest
  });
}

/**
 * Create a paragraph element
 */
export function createParagraph(options = {}) {
  const {
    text = '',
    className = '',
    ...rest
  } = options;

  return createElement('p', {
    className,
    text,
    ...rest
  });
}

/**
 * Create a container div
 */
export function createContainer(options = {}) {
  const {
    className = '',
    children = [],
    ...rest
  } = options;

  return createElement('div', {
    className,
    children,
    ...rest
  });
}

/**
 * Create a section element
 */
export function createSection(options = {}) {
  const {
    className = '',
    children = [],
    ...rest
  } = options;

  return createElement('section', {
    className,
    children,
    ...rest
  });
}

