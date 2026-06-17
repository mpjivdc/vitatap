/*
 * Prerender step: runs the built bundle.js inside jsdom and bakes the
 * resulting static markup into index.html (#root). This gives crawlers and
 * social scrapers real content in the initial HTML response - the React
 * bundle still loads and takes over on the client.
 *
 * Runs automatically at the end of `node build.js`, or standalone:
 *   node prerender.js
 */
const fs = require("fs");
const path = require("path");

const SITE = __dirname;
const START = "<!--PRERENDER_START-->";
const END = "<!--PRERENDER_END-->";

async function prerender() {
  const { JSDOM } = require("jsdom");
  const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
  const react = read("node_modules/react/umd/react.production.min.js");
  const reactDom = read("node_modules/react-dom/umd/react-dom.production.min.js");
  const bundle = read("bundle.js");

  const dom = new JSDOM(
    `<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>`,
    { runScripts: "outside-only", pretendToBeVisual: true, url: "https://vitatap.be/" }
  );
  const { window } = dom;
  // Minimal stubs for browser APIs touched during mount.
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  window.scrollTo = () => {};

  window.eval(react + "\n" + reactDom + "\n" + bundle);
  // Let React flush the initial synchronous render.
  await new Promise((r) => setTimeout(r, 400));

  const markup = window.document.getElementById("root").innerHTML;
  if (!markup || markup.length < 2000) {
    throw new Error("Prerender produced suspiciously little markup (" + markup.length + " chars)");
  }

  let html = read("index.html");
  const filled = `<div id="root">${START}${markup}${END}</div>`;
  const re = new RegExp(`<div id="root">[\\s\\S]*?${END}<\\/div>`);
  if (re.test(html)) {
    html = html.replace(re, filled);
  } else {
    html = html.replace('<div id="root"></div>', filled);
  }
  fs.writeFileSync(path.join(SITE, "index.html"), html, "utf8");
  dom.window.close();
  console.log("index.html prerendered:", markup.length, "chars baked into #root");
}

module.exports = prerender;

if (require.main === module) {
  prerender().catch((e) => { console.error(e); process.exit(1); });
}
