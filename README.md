# VitaTap

Landing page for **VitaTap** — _Zuiver, vitaal water. Elke dag._

Gezuiverd, geremineraliseerd en waterstofrijk water rechtstreeks uit je kraan:
6-staps moleculaire omgekeerde osmose, ~99,9% verwijdering van PFAS,
microplastics en meer.

## Live site

Hosted via GitHub Pages → **https://mpjivdc.github.io/vitatap/**

## How it works

A self-contained static site. `index.html` loads production **React** from a CDN
and a prebuilt **`bundle.js`** — the JSX is transpiled and minified ahead of time
(`build.js`), so there's no in-browser compiler and the page renders immediately.
Styling lives in `styles.css`; imagery in `assets/`.

No server needed — open `index.html` (or serve the folder statically) and it runs.

| File | Purpose |
|------|---------|
| `index.html` | Entry point — loads React + `bundle.js` |
| `bundle.js` | Prebuilt output (transpiled + minified JSX) |
| `build.js` | Regenerates `bundle.js` from the JSX sources |
| `app.jsx` | Root component, theme + section layout |
| `comp1`–`comp5.jsx` | Page sections (hero, science, pricing, FAQ, …) |
| `tweaks-panel.jsx` | Design-tool live editor (hidden for visitors) |
| `styles.css` | All styling |
| `assets/` | Product photography & marks |

## Rebuilding the bundle

Edit any `.jsx` source, then regenerate `bundle.js`:

```bash
npm install @babel/core @babel/preset-react terser react@18.3.1 react-dom@18.3.1
node build.js
```

`build.js` also prints fresh SRI hashes for the React CDN tags — paste them into
`index.html` if you bump the React version.
