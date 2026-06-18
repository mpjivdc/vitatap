/*
 * Build step: transpile the JSX sources into a single minified bundle.js and
 * print SRI hashes for the production React UMD builds.
 *
 *   npm install @babel/core @babel/preset-react terser jsdom react@18.3.1 react-dom@18.3.1
 *   node build.js
 *
 * If the React version changes, paste the printed SRI hashes into index.html.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const babel = require("@babel/core");
const { minify } = require("terser");

const SITE = __dirname;
const ORDER = ["tweaks-panel.jsx", "comp1.jsx", "comp2.jsx", "comp3.jsx", "comp4.jsx", "comp5.jsx", "app.jsx"];

async function main() {
  // 1. Transpile + concatenate in load order (preserves the shared global scope)
  let out = "";
  for (const f of ORDER) {
    const src = fs.readFileSync(path.join(SITE, f), "utf8");
    const res = babel.transformSync(src, {
      presets: [["@babel/preset-react", { runtime: "classic" }]],
      compact: false,
      comments: false,
    });
    out += `\n/* ${f} */\n` + res.code + "\n";
  }

  // 2. Minify
  const min = await minify(out, { compress: { passes: 2 }, mangle: true, format: { comments: false } });
  if (min.error) throw min.error;
  fs.writeFileSync(path.join(SITE, "bundle.js"), min.code, "utf8");
  console.log("bundle.js written:", min.code.length, "bytes (from", out.length, "raw)");

  // 3. Prerender the bundle into index.html (#root) for SEO / social scrapers
  await require("./prerender")();

  // 3b. Cache-busting: stamp the asset URLs in index.html with a short content
  // hash so a new deploy is never served from a stale browser/CDN cache.
  const shortHash = (file) => crypto.createHash("sha256").update(fs.readFileSync(path.join(SITE, file))).digest("hex").slice(0, 8);
  let indexHtml = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
  for (const asset of ["bundle.js", "styles.css", "fonts.css"]) {
    const v = shortHash(asset);
    const esc = asset.replace(/\./g, "\\.");
    indexHtml = indexHtml.replace(new RegExp(`((?:src|href)="${esc})(?:\\?v=[a-f0-9]+)?(")`, "g"), `$1?v=${v}$2`);
  }
  fs.writeFileSync(path.join(SITE, "index.html"), indexHtml, "utf8");
  console.log("cache-busting: stamped bundle.js, styles.css, fonts.css");

  // 4. SRI hashes for the production React UMD builds referenced in index.html
  const umd = {
    react: path.join(SITE, "node_modules/react/umd/react.production.min.js"),
    reactDom: path.join(SITE, "node_modules/react-dom/umd/react-dom.production.min.js"),
  };
  const sri = (file) => "sha384-" + crypto.createHash("sha384").update(fs.readFileSync(file)).digest("base64");
  console.log("REACT_SRI=" + sri(umd.react));
  console.log("REACTDOM_SRI=" + sri(umd.reactDom));
}
main().catch((e) => { console.error(e); process.exit(1); });
