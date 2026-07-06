/* global React */
const { useState, useEffect, useRef } = React;

/* ----------------------------------------------------------------
   Brand mark - official VitaTap "Vital Drop" logo
----------------------------------------------------------------- */
function Logo({ className = "logo" }) {
  return <img className={className} src="assets/vitatap-mark.png" alt="VitaTap" width="180" height="171" decoding="async" />;
}

/* ---- tiny line-icon set (currentColor) ---- */
const Ico = {
  arrow: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  check: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12.5l4.5 4.5L19 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  plus: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>,
  drop: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3c3 5 6 7.5 6 11a6 6 0 1 1-12 0c0-3.5 3-6 6-11Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" /></svg>,
  shield: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 12l2 2 4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  bolt: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>,
  leaf: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 15c2.5-2.5 5-4 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
  waves: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 8c2 0 2.5-2 4.5-2S10 8 12 8s2.5-2 4.5-2S19 8 21 8M3 14c2 0 2.5-2 4.5-2S10 14 12 14s2.5-2 4.5-2S19 14 21 14M3 20c2 0 2.5-2 4.5-2S10 20 12 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  bt: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M7 7l10 10-5 4V3l5 4L7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  clock: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  wrench: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M15 7a4 4 0 0 0-5 5L4 18l2 2 6-6a4 4 0 0 0 5-5l-2.5 2.5L13 9.5 15 7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>,
  pin: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 21c4-4 7-7.5 7-11a7 7 0 1 0-14 0c0 3.5 3 7 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" /></svg>,
  gauge: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 18a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M12 18l4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  spark: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>,
  phone: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  filter: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>,
  recycle: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M7 7l2-3 3 5M17 9l2 3-5 1M9 19l-3-1 1-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
};

/* ----------------------------------------------------------------
   HEADER
----------------------------------------------------------------- */
const NAV = [
["Aanpak", "#aanpak"], ["Werking", "#werking"], ["De Kraan", "#kraan"],
["Wetenschap", "#wetenschap"], ["Prijzen", "#prijzen"], ["Contact", "#contact"]];


function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "") + (open ? " menu-open" : "")}>
      <div className="wrap header-inner">
        <a className="brand" href="#top" aria-label="VitaTap home" onClick={() => setOpen(false)}>
          <Logo />
          <span className="wordmark">VitaTap</span>
        </a>
        <nav className="nav">
          {NAV.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a className="header-tel" href="tel:+32476371722" aria-label="Bel VitaTap">+32 476 37 17 22</a>
        <a className="header-wa" href="https://wa.me/32476371722" target="_blank" rel="noopener" aria-label="WhatsApp VitaTap">WhatsApp</a>
        <a className="btn header-cta" href="#contact">Gratis advies</a>
        <button className="menu-btn" aria-label={open ? "Sluit menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ?
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> :
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
        </button>
      </div>
      <div className={"mobile-menu" + (open ? " show" : "")}
      style={{ opacity: open ? 1 : 0, visibility: open ? "visible" : "hidden", transform: open ? "none" : "translateY(-10px)", pointerEvents: open ? "auto" : "none" }}>
        <nav>
          {NAV.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        </nav>
        <a className="btn btn-primary" href="#contact" onClick={() => setOpen(false)}>Vraag gratis advies <Ico.arrow className="arr" width="18" height="18" /></a>
        <div className="mobile-contact">
          <a href="tel:+32476371722">Bel +32 476 37 17 22</a>
          <a href="https://wa.me/32476371722" target="_blank" rel="noopener">Chat via WhatsApp</a>
        </div>
      </div>
    </header>);

}

/* ----------------------------------------------------------------
   HERO
----------------------------------------------------------------- */
const FINISH_LABEL = { steel: "Geborsteld staal", chrome: "Chroom", black: "Mat zwart", gold: "Geborsteld goud" };

function Hero({ t, finish }) {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow"><span className="dot" /> De wellness-utility voor thuis</p>
          <h1 className="display">{t.heroTitle}</h1>
          <p className="hero-sub">{t.heroSub}</p>
          <div className="hero-stats">
            <div className="stat-chip"><div className="val">tot 99,9%</div><div className="cap">PFAS, microplastics &amp; bacteriën</div></div>
            <div className="stat-chip"><div className="val">1200–1600 ppb</div><div className="cap">Moleculaire H₂</div></div>
            <div className="stat-chip"><div className="val">100%</div><div className="cap">UV-sterilisatie</div></div>
          </div>
          <div className="hero-actions">
            <a className="btn btn-primary solid-white" href="#contact">Vraag gratis advies <Ico.arrow className="arr" width="18" height="18" /></a>
            <a className="btn btn-ghost" href="#prijzen">Bekijk prijzen</a>
          </div>
          <p className="hero-fine">Vanaf €39 / mnd excl. btw · onderhoud &amp; filters inbegrepen · specificaties volgens fabrikant</p>
        </div>
        <div className="hero-media">
          <div className="hero-card">
            <span className="hero-finish-tag">{FINISH_LABEL[finish] || "Geborsteld staal"}</span>
            <div className="frame"><img src="assets/hero-lifestyle.webp" alt="Vrouw vult een glas met gezuiverd water aan de VitaTap-kraan" width="760" height="1351" loading="eager" fetchPriority="high" decoding="async" /></div>
            <div className="hero-badge">
              <span className="ico"><Ico.drop width="20" height="20" /></span>
              <div>
                <div className="t">Vers getapt</div>
                <div className="s">Gezuiverd + waterstofrijk</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ---- trust strip ---- */
function Trust() {
  return (
    <div className="trust">
      <div className="wrap" data-comment-anchor="d1878b9bf1-div-122-7">
        <span className="label">In één oogopslag</span>
        <div className="items">
          <span><span className="d" /><b>PFAS &amp; microplastics</b></span>
          <span><span className="d" /><b>6-staps omgekeerde osmose</b></span>
          <span><span className="d" /><b>UV-sterilisatie</b></span>
          <span><span className="d" /><b>H₂ via SPE</b></span>
          <span><span className="d" /><b>Lekbeveiliging</b></span>
          <span><span className="d" /><b>Erkende installateurs</b></span>
        </div>
      </div>
    </div>);

}

Object.assign(window, { Logo, Ico, Header, Hero, Trust });