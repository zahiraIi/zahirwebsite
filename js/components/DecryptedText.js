/**
 * DecryptedText component - Vanilla JS port
 * Text scrambling/reveal animation effect
 */

export function initDecryptedText(elementId, text, options = {}) {
  const {
    speed = 50,
    maxIterations = 10,
    sequential = false,
    revealDirection = 'start',
    useOriginalCharsOnly = false,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    className = 'text-white',
    encryptedClassName = 'text-white/40',
    animateOn = 'hover'
  } = options;

  const element = document.getElementById(elementId);
  if (!element) return;

  let displayText = text;
  let isHovering = false;
  let isScrambling = false;
  let revealedIndices = new Set();
  let hasAnimated = false;
  let interval = null;

  const availableChars = useOriginalCharsOnly
    ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
    : characters.split('');

  const getNextIndex = (revealedSet) => {
    const textLength = text.length;
    switch (revealDirection) {
      case 'start':
        return revealedSet.size;
      case 'end':
        return textLength - 1 - revealedSet.size;
      case 'center': {
        const middle = Math.floor(textLength / 2);
        const offset = Math.floor(revealedSet.size / 2);
        const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
          return nextIndex;
        }
        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i;
        }
        return 0;
      }
      default:
        return revealedSet.size;
    }
  };

  const shuffleText = (originalText, currentRevealed) => {
    if (useOriginalCharsOnly) {
      const positions = originalText.split('').map((char, i) => ({
        char,
        isSpace: char === ' ',
        index: i,
        isRevealed: currentRevealed.has(i)
      }));

      const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);

      for (let i = nonSpaceChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
      }

      let charIndex = 0;
      return positions
        .map(p => {
          if (p.isSpace) return ' ';
          if (p.isRevealed) return originalText[p.index];
          return nonSpaceChars[charIndex++];
        })
        .join('');
    } else {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    }
  };

  const updateDisplay = () => {
    if (isHovering || (animateOn === 'view' && hasAnimated)) {
      isScrambling = true;
      
      if (interval) clearInterval(interval);
      
      let currentIteration = 0;
      
      interval = setInterval(() => {
        if (sequential) {
          if (revealedIndices.size < text.length) {
            const nextIndex = getNextIndex(revealedIndices);
            revealedIndices.add(nextIndex);
            displayText = shuffleText(text, revealedIndices);
            renderText();
          } else {
            clearInterval(interval);
            isScrambling = false;
          }
        } else {
          displayText = shuffleText(text, revealedIndices);
          renderText();
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            isScrambling = false;
            displayText = text;
            renderText();
          }
        }
      }, speed);
    } else {
      displayText = text;
      revealedIndices.clear();
      isScrambling = false;
      renderText();
    }
  };

  const renderText = () => {
    element.innerHTML = displayText.split('').map((char, index) => {
      const isRevealedOrDone = revealedIndices.has(index) || !isScrambling || !isHovering;
      const charClass = isRevealedOrDone ? className : encryptedClassName;
      return `<span class="${charClass}">${char === ' ' ? '&nbsp;' : char}</span>`;
    }).join('');
  };

  // Event handlers
  if (animateOn === 'hover' || animateOn === 'both') {
    element.addEventListener('mouseenter', () => {
      isHovering = true;
      updateDisplay();
    });

    element.addEventListener('mouseleave', () => {
      isHovering = false;
      updateDisplay();
    });
  }

  // Intersection Observer for view animation
  if (animateOn === 'view' || animateOn === 'both') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          isHovering = true;
          hasAnimated = true;
          updateDisplay();
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    observer.observe(element);
  }

  // Initial render
  renderText();
}

