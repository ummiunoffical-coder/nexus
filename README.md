# NEXUS — The Future Is Here

A complete, self-contained cyberpunk landing page: an animated neon city,
a friendly AI robot, and interactive sections — built with plain
**HTML + CSS + JavaScript. No frameworks, no build step, no internet
connection required.** Just open it.

## Files

| File | What it is |
|---|---|
| `index.html` | Page structure: hero, Discover, Nexus Core, Signal, footer |
| `style.css` | Cyberpunk theme, layout, animations, responsive + reduced-motion rules |
| `script.js` | Procedural neon-city canvas, parallax, cards, counters, demo form, clock |
| `poster.jpg` | Official NEXUS poster (NEXA in the neon rain); also the link-share preview image |
| `README.md` | This file |

## Preview locally

**Easiest:** double-click `index.html` — it opens in any browser
(Chrome, Edge, Firefox, Safari, Android browser).

**Or serve it** (recommended, exactly like a real site):

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000
```

```powershell
# Windows PowerShell alternative
npx serve .
```

## Publish for free

### GitHub Pages
1. Create a free account at https://github.com (if you don't have one).
2. Create a new **public** repository, e.g. `nexus`.
3. Upload `index.html`, `style.css`, `script.js` (and this README) to it
   — *Add file → Upload files*.
4. Go to **Settings → Pages**.
5. Under *Build and deployment*, choose **Deploy from a branch**,
   branch `main`, folder `/ (root)`, then **Save**.
6. After a minute your site is live at
   `https://<your-username>.github.io/nexus/`

### Netlify (drag & drop)
1. Go to https://app.netlify.com/drop
2. Drag the whole project **folder** onto the page.
3. Netlify publishes it instantly and gives you a public URL.
   (Create a free account to keep and rename the site.)

## Notes

- **NEXA guide bot:** the "Ask NEXA" button (bottom-right) opens a
  rule-based chat that answers questions about NEXUS — sections, the
  Core, the Signal, pricing and privacy. Fully local, like everything
  else here: no server, no data leaves the browser.
- **Signal form:** real — name/email/message are delivered to the
  site keeper's inbox via FormSubmit (AJAX endpoint). Browsing and
  the NEXA chat stay fully local; only a message a visitor chooses
  to send leaves the page.
  Nothing typed into it is sent or stored anywhere.
- **Performance:** the city, stars and particles are drawn on a single
  canvas with capped counts and pixel ratio; the animation pauses
  itself down to one static frame when the visitor prefers reduced motion.
- **Accessibility:** semantic landmarks, skip link, visible focus rings,
  keyboard-operable cards and menu, `prefers-reduced-motion` respected.
- **Fallback:** if the canvas cannot run, the CSS night-sky gradient and
  the SVG robot still present the full hero.
- The robot ("NEXA, Unit N-X1") is a hand-built layered SVG — no external
  model files, so nothing can break or go missing.
