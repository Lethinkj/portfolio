# Lethin K J — Retro Ambient Portfolio

A fully responsive, interactive portfolio showcasing skills, projects, and certifications with a retro neon aesthetic, ambient canvas animations, and smooth cursor follower effects.

## ✨ Features

- **Retro Neon Design** – CRT scanlines, neon glows, and ambient color palette
- **Canvas Animations** – Ambient particles with wavy motion, scroll-influenced vignette
- **Cursor Follower** – Smooth dot and ring that follows your mouse with easing
- **Scroll Animations** – Cards fade in and slide up as you scroll
- **Fully Responsive** – Optimized for mobile (480px), tablet (768px), and desktop (1024px+)
- **Interactive Elements** – Hover effects on projects, cards, and links
- **Accessibility** – Reduced motion support, keyboard navigation, ARIA labels
- **Performance** – Dynamic particle count based on screen size, efficient rendering

## 📋 Sections

1. **Hero** – Welcome banner with CTA buttons
2. **About** – Bio and introduction
3. **Skills** – 5 categories: Languages, Web & Backend, Embedded & Hardware, Tools & Platforms
4. **Projects** – Featured projects including:
   - **BashXCode** – Coding contest platform (Next.js, MongoDB)
   - **Arduino Self-Driving Car** – Autonomous rover with obstacle avoidance
   - **Retro Ambient Portfolio** – This portfolio itself
5. **Certifications** – 3 certifications with placeholder links
6. **Contact** – LinkedIn, GitHub, and Email links

## 🚀 Quick Start

### Option 1: Open directly in browser
Double-click `index.html` or open it from your browser's file menu.

### Option 2: Use a local server
```powershell
# If you have Node.js installed:
npx serve . -p 3000

# Then visit: http://localhost:3000
```

### Option 3: VS Code Live Server
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → "Open with Live Server"

## 📝 Customization

### Update personal details
Edit `index.html`:
- Replace skills in the **Skills section**
- Update project links and descriptions in the **Projects section**
- Add certification links in the **Certifications section**
- Update contact email

### Modify colors
Edit `:root` variables in `styles.css`:
```css
--bg: #07030a;       /* Background */
--neon: #00ffe1;     /* Cyan accent */
--accent: #ff44cc;   /* Magenta accent */
--muted: #9aa0b2;    /* Text muted */
```

### Adjust animations
- Particle count: `script.js` line ~15 (PT variable)
- Animation speed: `styles.css` keyframes
- Cursor follower easing: `script.js` line ~85 (ease function)

## 📱 Responsive Breakpoints

- **480px and below** – Mobile layout, single column
- **768px** – Tablet layout, optimized spacing
- **1024px and above** – Desktop layout, full grid

## ♿ Accessibility

- Respects `prefers-reduced-motion` for users with vestibular disorders
- Keyboard navigation with visible focus outlines
- ARIA labels for semantic HTML
- Color contrast WCAG AA compliant

## 📦 Files

```
d:\portfolio\
├── index.html       # Main HTML structure
├── styles.css       # All styling & animations
├── script.js        # Canvas, cursor follower, scroll effects
├── package.json     # Node scripts & metadata
└── README.md        # This file
```

## 🎨 Design Inspiration

The design draws from:
- **CRT/VHS aesthetics** – Retro scanlines and glitch-like effects
- **Cyberpunk aesthetics** – Neon glows and dark backgrounds
- **Motion design** – Smooth easing functions and layered animations
- **Modern web standards** – CSS Grid, Flexbox, Canvas API

## 🔗 Links

- **LinkedIn**: https://www.linkedin.com/in/lethin-k-j-510674293
- **Project**: BashXCode at https://bashxcode.vercel.app

## 📄 License

MIT – Feel free to use and modify for your own portfolio!

---

**Built with vanilla HTML, CSS, and JavaScript. No frameworks, pure ambient vibes.** ✨
