# 🎬 Portfolio Features Showcase

## Visual Design

### Color Palette
```
Background:  #07030a (Deep Space)
Primary:     #00ffe1 (Neon Cyan)
Accent:      #ff44cc (Hot Magenta)
Muted:       #9aa0b2 (Cool Gray)
```

### Typography
- **Logo/Headers**: Press Start 2P (monospace, retro)
- **Body Text**: Space Grotesk (modern geometric sans-serif)

### Effects
- CRT scanlines (repeating lines)
- Neon glows on hover
- Ambient particle trail
- Cursor follower dot + ring
- Card elevation on scroll

---

## Interactive Elements

### Cursor Follower
- **Dot**: Fast-moving (0.22s), core cursor position
- **Ring**: Slow-moving (0.08s), trailing effect
- Glows with cyan neon color
- Disabled on reduced-motion preference

### Particle System
- **Count**: 90 desktop / 50 mobile
- **Motion**: Wavy pattern + random drift
- **Colors**: Cyan to blue hues
- **Effect**: Ambient background movement, scroll-influenced vignette

### Scroll Animations
- Cards fade in + slide up with staggered delays
- Vignette intensity increases with scroll depth
- Smooth transitions (0.6s cubic-bezier)

### Hover Effects
- **Cards**: Brighten border, enhance shadow, subtle lift
- **Projects**: Card lifts 4px, brightness increase
- **Links**: Color shift, text glow shadow

---

## Responsive Breakpoints

### Desktop (1024px+)
- 2-column hero (text + avatar)
- Multi-column grids for skills/projects
- Full particle count
- Comfortable padding

### Tablet (768px)
- Single column layouts
- Skills in 2-col grid
- Reduced padding
- Projects full-width

### Mobile (480px)
- All single column
- Smaller fonts (18-20px headings)
- Compact buttons
- 50 particles for performance
- Touch-friendly tap targets

---

## Accessibility Features

### Motion
- `prefers-reduced-motion` support
- Canvas effects disabled for motion-sensitive users
- Cursor follower hidden on mobile
- Smooth easing (no harsh transitions)

### Keyboard
- Visible focus outlines on Tab
- Proper heading hierarchy (h1→h6)
- Semantic HTML (nav, section, article, main)
- ARIA labels where needed

### Color Contrast
- WCAG AA compliant (4.5:1+ for text)
- Cyan & magenta work well on dark background
- No color-only information

---

## Performance Optimizations

✅ Responsive canvas sizing
✅ Particle count scales with screen size
✅ No external dependencies (pure JS)
✅ Efficient DOM queries with caching
✅ IntersectionObserver for scroll detection
✅ RequestAnimationFrame for smooth 60fps
✅ CSS Grid/Flexbox (no floats)

---

## Animation Timing

| Element | Duration | Timing | Delay |
|---------|----------|--------|-------|
| Cards (fade-in) | 0.8s | cubic-bezier | 0.1-0.7s staggered |
| Title (glow) | 3s | ease-in-out | none (infinite) |
| Particle wave | continuous | sine pattern | random |
| Cursor follower | 0.05-0.1s | linear | real-time |
| Hover brighten | 0.3s | ease | on-hover |

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)
- ✅ Canvas API required
- ⚠️ IE11 not supported (uses modern CSS/JS)

---

## File Sizes (Approximate)

| File | Size | Purpose |
|------|------|---------|
| index.html | ~5KB | Structure |
| styles.css | ~8KB | All styling + animations |
| script.js | ~4KB | Canvas + interactions |
| **Total** | **~17KB** | **Fast load times** |

---

## Usage Statistics

- **Fonts**: 2 Google Fonts (Press Start 2P, Space Grotesk)
- **APIs Used**: Canvas 2D, Intersection Observer, requestAnimationFrame
- **Dependencies**: 0 (no npm packages needed)
- **JavaScript**: Vanilla (no framework)
- **Animations**: 6 main keyframes

---

## Customization Guide

### Change Colors
Edit `:root` in `styles.css`:
```css
--neon: #00ff00;    /* New cyan */
--accent: #ffff00;  /* New magenta */
```

### Adjust Particles
In `script.js` line 15:
```js
const PT = window.innerWidth < 768 ? 30 : 120;  // Desktop/Mobile count
```

### Modify Animations
Update `@keyframes` in `styles.css`:
- `pulse` – Avatar glow speed
- `fadeIn` – Card entrance
- `glow` – Title text effect
- `slideInLeft` – Footer entrance

### Update Content
Edit `index.html`:
- Replace "Lethin K J" with your name
- Update skills in the grid
- Add your certifications
- Update project descriptions

---

**Portfolio is production-ready & fully customizable!** 🚀