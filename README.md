# VitaTap

Landing page for **VitaTap** — _Zuiver, vitaal water. Elke dag._

Gezuiverd, geremineraliseerd en waterstofrijk water rechtstreeks uit je kraan:
6-staps moleculaire omgekeerde osmose, ~99,9% verwijdering van PFAS,
microplastics en meer.

## Live site

Hosted via GitHub Pages → **https://mpjivdc.github.io/vitatap/**

## How it works

This is a self-contained static site. `index.html` loads React + Babel from a
CDN and transpiles the JSX components (`comp1`–`comp5.jsx`, `app.jsx`) in the
browser. Styling lives in `styles.css`; imagery in `assets/`.

No build step is required — open `index.html` (or serve the folder) and it runs.

| File | Purpose |
|------|---------|
| `index.html` | Entry point (copy of `VitaTap.html`) |
| `app.jsx` | Root component, theme + section layout |
| `comp1`–`comp5.jsx` | Page sections (hero, science, pricing, FAQ, …) |
| `tweaks-panel.jsx` | Design-tool live editor (hidden for visitors) |
| `styles.css` | All styling |
| `assets/` | Product photography & marks |
