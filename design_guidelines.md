# Design Guidelines: Zahir Ali Personal Portfolio

## Design Approach

**Reference-Based Design** inspired by zainkhatri.com and zuhair.io aesthetics:
- Minimalist storytelling with dark, sophisticated theme
- Smooth scroll-driven narrative flow
- Technical elegance that reflects ML/AI expertise
- Professional yet approachable personality

## Color Palette

**Dark Mode Foundation:**
- Background: 12 8% 6% (deep charcoal, almost black)
- Surface: 220 10% 12% (slightly lighter panels)
- Border: 220 8% 20% (subtle dividers)

**Primary Colors:**
- Primary: 210 100% 65% (bright blue - tech-forward, trustworthy)
- Primary Hover: 210 100% 70%

**Accent & Semantic:**
- Accent: 280 70% 65% (purple - creative, ML/AI association)
- Success: 142 70% 50% (green for highlights)
- Muted Text: 220 10% 60% (secondary information)
- Foreground: 0 0% 95% (primary text)

**Three.js Particle Colors:**
- Use gradients between Primary (210 100% 65%) and Accent (280 70% 65%)
- Particles should glow subtly with 20% opacity

## Typography

**Font Stack:**
- Primary: 'Inter' - Clean, modern, excellent for tech content
- Monospace: 'JetBrains Mono' - Code snippets and technical details

**Type Scale:**
- Hero Heading: text-6xl md:text-7xl lg:text-8xl, font-bold
- Section Headings: text-4xl md:text-5xl, font-semibold
- Subsection Headings: text-2xl md:text-3xl, font-medium
- Body: text-base md:text-lg, leading-relaxed
- Small/Meta: text-sm, text-muted-foreground
- Code/Tech Stack: text-sm, font-mono

## Layout System

**Spacing Primitives:**
Use Tailwind units: 4, 8, 12, 16, 20, 24, 32
- Section Padding: py-20 md:py-32
- Container Max Width: max-w-7xl
- Content Max Width: max-w-4xl for text-heavy sections
- Grid Gaps: gap-8 md:gap-12

**Grid Systems:**
- Projects: grid-cols-1 md:grid-cols-2 gap-8
- Skills: grid-cols-2 md:grid-cols-4 gap-4
- Timeline: Single column with left-aligned markers

## Three.js Integration

**Hero Section Background:**
- Animated particle field (1000-2000 particles)
- Particles drift slowly in 3D space with subtle mouse-follow interaction
- Gradient colors from blue to purple
- Low opacity (15-25%) to maintain text readability
- Particles connect with thin lines when within proximity

**Interactive Objects:**
- Floating geometric shapes (icosahedron, torus) on scroll
- Objects rotate slowly on Y-axis
- Mouse hover triggers gentle rotation acceleration
- Positioned strategically between sections as visual breaks

**Animated Text:**
- Hero title uses Three.js TextGeometry with gradient material
- Subtitle animates in with staggered fade + slide up
- Maintain fallback HTML text for accessibility

## Component Library

**Navigation:**
- Fixed top nav with glass morphism effect (backdrop-blur-md)
- Logo/name on left, section links on right
- Mobile: hamburger menu with slide-in drawer
- Active section indicator with underline animation

**Hero Section:**
- Full viewport height (min-h-screen)
- Three.js particle background
- Center-aligned animated text
- Name in large display font
- Tagline: "ML Engineer | AI Researcher | Full Stack Developer"
- Scroll indicator (animated chevron down)

**About Section:**
- Two-column layout (image left, text right on desktop)
- Professional photo with subtle border glow effect
- Bio paragraph with current role at UCSD
- Education details (UCSD, Cognitive Science ML)
- Leadership roles (VP Education, Fraternity VP)
- Tech stack badges with hover effects

**Projects Showcase:**
- Card-based grid layout (2 columns desktop, 1 mobile)
- Each card: Project title, tech stack pills, description, GitHub link, live demo (if applicable)
- Featured projects: ML-Lab-Summer-2025, Theology LLM Evaluation, TritonGuard, ApplyPal
- Hover effect: Subtle lift (translateY(-4px)) with shadow increase
- Tech stack uses colored badges: Python (blue), ML frameworks (purple), React (cyan)

**Work Experience Timeline:**
- Vertical timeline with connecting line
- Timeline nodes: Date badges with colored dot indicators
- Each entry: Company logo area, role title, date range, bullet points
- UCSD ML Research and ASCE prominently featured
- Achievements use checkmark icons

**Skills Section:**
- Categorized into: Languages, ML/AI Frameworks, Web Technologies, Tools
- Grid layout with hoverable skill cards
- Each card shows icon + name
- Group by category with subtle background separation

**Contact Section:**
- Center-aligned with Three.js floating objects
- Email (z5ali@ucsd.edu), GitHub, LinkedIn, Twitter/X icons
- Large, clickable social icons with hover scale
- Contact form: Name, Email, Message fields with glass morphism styling
- Submit button with loading state animation

**Resume Download:**
- Prominent CTA button in hero and contact sections
- Icon + "Download Resume" text
- Opens PDF in new tab

## Images & Visual Assets

**Hero Section:**
- No large hero image - Three.js particle background provides visual interest
- Focus on animated text and particles

**About Section:**
- Professional headshot: 400x400px, rounded corners (rounded-2xl)
- Subtle border glow using box-shadow with primary color
- Position: Left side on desktop, center on mobile

**Project Cards:**
- Project thumbnail/screenshot for each project (16:9 aspect ratio)
- Placeholder: Abstract gradient pattern if no screenshot available
- Images should have subtle overlay on hover for link indication

**Background Patterns:**
- Subtle dot grid pattern at 5% opacity across entire page
- Gradient overlay from top (dark) to middle (slightly lighter) for depth

## Animations

**Scroll Animations:**
- Sections fade in + slide up on scroll (using Intersection Observer)
- Stagger animations for project cards (100ms delay between each)
- Timeline entries appear from left with fade

**Micro-interactions:**
- Button hover: Scale 1.05, slight shadow increase
- Card hover: translateY(-4px), shadow enhancement
- Link hover: Underline animation (width 0 to 100%)
- Three.js objects: Gentle rotation on mouse proximity

**Page Transitions:**
- Smooth scroll behavior between sections
- Navigation clicks animate scroll with easing

## Responsive Breakpoints

- Mobile: < 768px - Single column, stacked layout, simplified Three.js
- Tablet: 768px - 1024px - Two columns where appropriate
- Desktop: > 1024px - Full multi-column layouts, enhanced Three.js effects

## Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus indicators with primary color outline
- Reduced motion queries disable Three.js animations
- Semantic HTML structure (header, nav, main, section, footer)
- Color contrast ratios meet WCAG AA standards (4.5:1 for body text)