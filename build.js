/*
 * Build step: transpile the JSX sources into a single minified bundle.js and
 * print SRI hashes for the production React UMD builds.
 *
 *   npm install @babel/core @babel/preset-react terser react@18.3.1 react-dom@18.3.1
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
    const res = babel.transform(src, {
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

  // 3. SRI hashes for the production React UMD builds referenced in index.html
  const sri = (mod) => "sha384-" + crypto.createHash("sha384")
    .update(fs.readFileSync(require.resolve(mod))).digest("base64");
  console.log("REACT_SRI=" + sri("react/umd/react.production.min.js"));
  console.log("REACTDOM_SRI=" + sri("react-dom/umd/react-dom.production.min.js"));
}
main().catch((e) => { console.error(e); process.exit(1); });
