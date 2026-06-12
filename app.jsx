/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakSelect, TweakRadio, TweakText,
   Header, Hero, Trust, Aanpak, Werking, Wetenschap, Dashboard, DeKraan, Lifestyle, Prijzen, Locator, Installer, FAQ, CTA, Advies, StickyCTA, Footer */
const { useState: uSA, useEffect: uEA } = React;

/* palette presets - accent hex maps to an oklch hue + chroma multiplier */
const PALETTES = {
  "#1FA9A6": { hue: 195, c: 1.0,  label: "Teal" },
  "#2E78D0": { hue: 233, c: 0.92, label: "Ocean" },
  "#0E8E90": { hue: 201, c: 1.28, label: "Lagoon" },
  "#37B894": { hue: 168, c: 1.06, label: "Mint" },
};
const TEAL_L = { 50: .975, 100: .95, 300: .85, 400: .76, 500: .68, 600: .61, 700: .54, 800: .47, 900: .41, 950: .34 };
const TEAL_C = { 50: .012, 100: .022, 300: .06, 400: .088, 500: .103, 600: .098, 700: .088, 800: .078, 900: .068, 950: .055 };

function oklchToRgb(L, C, h) {
  const hr = h * Math.PI / 180, a = C * Math.cos(hr), b = C * Math.sin(hr);
  let l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  let m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  let s_ = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  let R = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  let G = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  let B = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;
  const g = (x) => { x = x <= 0 ? 0 : x >= 1 ? 1 : x; return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055; };
  const to = (v) => Math.round(Math.max(0, Math.min(1, g(v))) * 255);
  return `rgb(${to(R)}, ${to(G)}, ${to(B)})`;
}

/* wordmark fonts: family → [weight, tracking, size] zodat brede fonts niet ontsporen */
const WORDMARKS = {
  "Krona One":     [400, "0.04em",  "14.5px"],
  "Unbounded":     [600, "0.05em",  "14.5px"],
  "Montserrat":    [800, "0.14em",  "15px"],
  "Poppins":       [600, "0.12em",  "15.5px"],
  "Raleway":       [800, "0.15em",  "15px"],
  "Nunito":        [800, "0.10em",  "16px"],
  "Space Grotesk": [700, "0.14em",  "16px"],
  "Archivo":       [800, "0.16em",  "16px"],
};

function applyTheme(t) {
  const root = document.documentElement;
  const p = PALETTES[t.accent] || PALETTES["#1FA9A6"];
  for (const k in TEAL_L) {
    root.style.setProperty("--teal-" + k, oklchToRgb(TEAL_L[k], TEAL_C[k] * p.c, p.hue));
  }
  root.style.setProperty("--font-display", `'${t.display}', system-ui, sans-serif`);
  root.style.setProperty("--font-body", `'${t.body}', system-ui, sans-serif`);
  const wm = WORDMARKS[t.wordmark] || WORDMARKS["Krona One"];
  root.style.setProperty("--font-wordmark", `'${t.wordmark || "Krona One"}', system-ui, sans-serif`);
  root.style.setProperty("--wm-weight", String(wm[0]));
  root.style.setProperty("--wm-track", wm[1]);
  root.style.setProperty("--wm-size", wm[2]);
  const pad = { compact: "88px", regular: "120px", comfy: "164px" }[t.density] || "88px";
  root.style.setProperty("--section-pad", pad);
}

/* reveal-on-scroll for a curated set of elements */
function useReveal(dep) {
  uEA(() => {
    const sel = ".sec-head, .stat-chip, .step-item, .sci-card, .sci-shot, .callout, .feature-row, .phone, .werk-step, .werking-faucet, .life-card, .price-card, .install-card, .install-meta .m, .faq-item, .startup-banner, .liter-compare, .advies-form";
    const els = Array.from(document.querySelectorAll(sel));
    els.forEach((el, i) => { el.classList.add("reveal"); el.style.transitionDelay = (i % 6) * 0.05 + "s"; });
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1FA9A6",
  "display": "Archivo",
  "body": "Figtree",
  "wordmark": "Raleway",
  "density": "compact",
  "finish": "steel",
  "heroTitle": "Zuiver. Vitaal. Onbeperkt.",
  "heroSub": "6-staps omgekeerde osmose met UV-sterilisatie en moleculaire H₂. Verwijdert ~97% van opgeloste stoffen en houdt PFAS, microplastics en bacteriën tegen - daarna geremineraliseerd en verrijkt met waterstof. Vanaf €39 per maand, onderhoud en filters inbegrepen."
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [finish, setFinish] = uSA(t.finish);

  uEA(() => applyTheme(t), [t.accent, t.display, t.body, t.density, t.wordmark]);
  uEA(() => setFinish(t.finish), [t.finish]);
  useReveal(t.density);

  return (
    <React.Fragment>
      <Header />
      <main>
        <Hero t={t} finish={finish} />
        <Trust />
        <Aanpak />
        <Werking />
        <Wetenschap />
        <Dashboard />
        <DeKraan finish={finish} setFinish={setFinish} />
        <Lifestyle />
        <Prijzen />
        <Locator />
        <Installer />
        <FAQ />
        <CTA />
        <Advies />
      </main>
      <Footer />
      <StickyCTA />

      <TweaksPanel>
        <TweakSection label="Kleur" />
        <TweakColor label="Accent" value={t.accent} options={Object.keys(PALETTES)} onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Typografie" />
        <TweakSelect label="Wordmark" value={t.wordmark} options={Object.keys(WORDMARKS)} onChange={(v) => setTweak("wordmark", v)} />
        <TweakSelect label="Titels" value={t.display} options={["Archivo", "Sora", "Space Grotesk"]} onChange={(v) => setTweak("display", v)} />
        <TweakSelect label="Tekst" value={t.body} options={["Figtree", "Hanken Grotesk", "DM Sans"]} onChange={(v) => setTweak("body", v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Ruimte" value={t.density} options={["compact", "regular", "comfy"]} onChange={(v) => setTweak("density", v)} />
        <TweakSelect label="Standaard finish" value={t.finish} options={["steel", "chrome", "black", "gold"]} onChange={(v) => setTweak("finish", v)} />
        <TweakSection label="Hero-tekst" />
        <TweakText label="Titel" value={t.heroTitle} onChange={(v) => setTweak("heroTitle", v)} />
        <TweakText label="Subtitel" value={t.heroSub} onChange={(v) => setTweak("heroSub", v)} multiline />
      </TweaksPanel>
    </React.Fragment>
  );
}

applyTheme(TWEAK_DEFAULTS);
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
