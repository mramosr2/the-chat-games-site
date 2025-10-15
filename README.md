# The Chat Games — README

## Overview
The Chat Games is a lightweight Bootstrap 5 site for CSU outreach events led by ChatGPT Student Ambassadors. It teaches ethical and effective AI use through short, social games that run inside ChatGPT. The site is fully static and deploys cleanly to GitHub Pages.

Pages included are `index.html`, `about.html`, `games.html`, and `faq.html`. Shared assets live in `css/stylesheet.css`, `js/main.js`, `images/`, and `videos/`.

## Features
- Black fixed navbar with animated underline links and a sticky footer.
- Soft body fade‑in on load, plus scroll‑reveal animations using a `.fade-seq` wrapper with `.fade-slide` children (one‑second sequence).
- Home hero centers the logo above an “Explore Games” button and feature badges.
- Live Demo section uses an HTML5 video with a poster and captions that default to showing.
- RSVP and Contact modals submit to Formspree with in‑modal validation and a clear subject line.
- About page shows alternating bio cards (Diego first, Michael second) with LinkedIn buttons.
- Games page presents four GPT‑based games in a clean 2×2 grid with compact icons.
- Copy notes that GPTs must be launched from a personal ChatGPT account because school accounts disable GPTs.

## Repository structure
```
/
├─ index.html
├─ about.html
├─ games.html
├─ faq.html
├─ css/
│  └─ stylesheet.css
├─ js/
│  └─ main.js
├─ images/
│  ├─ All images...
│  
│  
└─ videos/
   ├─ demo.mp4
   └─ demo.en.vtt
```

## Local development
You can open `index.html` directly, but running a tiny local server is better for video captions and caching.

Python 3:
```bash
# from the project root
python3 -m http.server 8000
# visit http://localhost:8000
```

Node (serve):
```bash
npx serve .
```

No build step is required. Edit HTML, CSS, or JS and refresh the browser.

## Deployment to GitHub Pages
Commit and push the repository. In GitHub, open **Settings → Pages**. Choose “Deploy from a branch,” pick the `main` branch and the root folder, then save. Pages will publish shortly. If you use a custom domain, add your DNS records and an optional `CNAME` file.

## Configuration

### Forms (RSVP and Contact)
Both modals submit to Formspree. The current endpoint is:
```
https://formspree.io/f/xpwyyeek
```
Replace it in `index.html` if you fork the project. Form inputs include basic HTML validation and show success or error notices inside the modal.

### Video captions
The demo video lives at `videos/demo.mp4` with a poster and an English VTT file at `videos/demo.en.vtt`. Captions default to “showing” via the `<track default>` attribute. If captions do not appear locally, use the local server instructions above.

Example track:
```html
<track src="videos/demo.en.vtt" kind="captions" srclang="en" label="English" default>
```

### Games listing
The Games page links open GPTs in a new tab.  
Emojination: https://chatgpt.com/g/g-68ed80ff5c78819181dca2b76e24394f-emojination  
Riddle Room: https://chatgpt.com/g/g-68ee022e84288191b3376bd3f18b2745-riddle-room  
Mr. Detective: https://chatgpt.com/g/g-68ee2375d8fc8191be3da0bff0302903-mr-detective-gpt  
Prompt Runner: https://chatgpt.com/g/g-68ee1abdf3108191b4925c7dcb07cae7-prompt-runner  

**Note:** Play on a personal ChatGPT account (school accounts disable GPTs).

## Accessibility
High‑contrast dark navbar and light content cards improve readability. All images include descriptive alt text. The demo video provides captions by default. Interactive controls use native buttons and anchors for keyboard and screen reader support. Animations are brief and staged; consider honoring `prefers-reduced-motion` in `css/stylesheet.css` if you extend motion.

## Animations and layout helpers
`.fade-seq` wraps a group of elements. Each child with `.fade-slide` staggers in using a one‑second sequence. The fixed navbar is measured in `js/main.js`, which sets a `--nav-h` CSS variable and applies a top offset so page titles never collide with the navbar. Section cards and game/feature cards use rounded corners, soft shadows, and hover lift for a modern feel.

## Editing bio cards
About page bios are alternating rows. Diego’s image sits left with the heading “About Diego Ayala” and a LinkedIn button. Michael’s row uses `flex-md-row-reverse` so the image sits right and includes the same LinkedIn button style. Update images in `images/` and edit copy directly in `about.html`.

## Customization
Replace `images/logo-chat-games.png` to change the hero. Swap `images/diego-ayala.jpg` and `images/michael-ramos.jpg` with your preferred portraits. Update `videos/demo.mp4` and `videos/demo.en.vtt` if you record a new demo. To change game descriptions or icons, edit the card bodies in `games.html`.

## Credits
Created for CSU outreach by Diego Ayala (Business Marketing, CSUN) and Michael Ramos (Computer Science, CSULA), ChatGPT Student Ambassadors. Site design and development by Michael Ramos with Bootstrap 5 and vanilla JavaScript.

## License
Choose a license that fits your needs. MIT is a good default; add a `LICENSE` file to the repository if you select it.
