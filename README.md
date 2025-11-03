<<<<<<< HEAD
my name is zahir ali, sophomore at UCSD studying Cognitive Science with a specialization in machine learning and neural computation. I am from the the bay, love to hang out with friends & family, explore and travel, go on late night drives.

this is my personal website built using react, typescript, html, css, and js :)
=======
# Zahir Ali - Personal Website

A modern, performant personal portfolio website built with ** HTML, CSS, and JavaScript** 

## Running Locally

Simply run:

```bash
npm run dev
```

Then open **http://localhost:8000** in your browser.

### Alternative Ports

If port 8000 is already in use:

```bash
# Use port 3000
npm run dev:3000

# Or use port 8080
npm run dev:8080
```

### Troubleshooting

**If you get "Address already in use" error:**

```bash
# Kill the process on port 8000
lsof -ti:8000 | xargs kill -9

# Then run again
npm run dev
```

**Why HTTP Server?** This site uses ES6 modules which require HTTP/HTTPS (not `file://`). Don't open `index.html` directly - it won't work!

## Architecture

This is a vanilla JavaScript application with a clean, modular structure:

```
/
├── index.html              # Main HTML structure
├── css/
│   └── style.css          # All styles (no preprocessor)
├── js/
│   ├── main.js           # Entry point
│   ├── app.js            # Application initialization
│   ├── core/             # Core DOM utilities
│   │   ├── dom.js        # DOM manipulation helpers
│   │   └── elements.js   # Element factories
│   ├── config/           # Configuration
│   │   └── app.js        # App settings
│   ├── components/       # Reusable components
│   │   ├── AboutSection.js
│   │   ├── ProjectsSection.js
│   │   ├── TravelingSection.js
│   │   ├── MusicSection.js
│   │   ├── FriendsSection.js
│   │   ├── LiquidChrome.js
│   │   ├── DecryptedText.js
│   │   ├── MusicGallery.js
│   │   ├── ProjectDialog.js
│   │   └── HoverLinkPreview.js
│   ├── sections/         # Section initializers
│   │   ├── initAbout.js
│   │   ├── initProjects.js
│   │   ├── initTraveling.js
│   │   ├── initMusic.js
│   │   ├── initFriends.js
│   │   └── index.js
│   ├── utils/            # Utility functions
│   │   ├── animations.js
│   │   ├── helpers.js
│   │   └── modal.js
│   └── data/             # Static data
│       ├── images.js
│       └── projects.js
└── attached_assets/      # Images and media files
```

## Features

- **Pure Vanilla JS** - No frameworks or build tools
- **ES6 Modules** - Native browser module system
- **Modular Architecture** - Clean separation of concerns
- **Performance Optimized** - Lazy loading, intersection observers
- **Responsive Design** - Mobile-first approach
- **WebGL Effects** - Liquid chrome background animation
- **Smooth Animations** - CSS + Intersection Observer

## Deployment

This site is configured for deployment on **Vercel** with zero configuration:

1. Push to your repository
2. Connect to Vercel
3. Deploy automatically

No build step required - Vercel serves the static files directly.

## Code Structure

### Core Utilities (`js/core/`)

Reusable DOM manipulation helpers:

- `dom.js` - Element creation, querying, manipulation
- `elements.js` - Pre-built element factories (buttons, links, images, etc.)

### Components (`js/components/`)

Reusable UI components:

- Sections: About, Projects, Traveling, Music, Friends
- Effects: LiquidChrome (WebGL), DecryptedText (animation)
- UI: MusicGallery, ProjectDialog, HoverLinkPreview

### Sections (`js/sections/`)

Section initialization logic - each section has its own initializer file for better organization.

### Configuration (`js/config/`)

Centralized app configuration - all settings in one place.

## Technologies

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, responsive design
- **Vanilla JavaScript (ES6+)** - Modules, classes, async/await
- **WebGL** - For background effects (via OGL library from CDN)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires ES6 module support (all modern browsers).

## License

© 2025 Zahir Ali
>>>>>>> 8ac2e22 (revised tech stack + optimized)
