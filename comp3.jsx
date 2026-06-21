/* global React, Ico */
const { useState: uS3, useEffect: uE3, useRef: uR3 } = React;

/* ----------------------------------------------------------------
   WELLNESS DASHBOARD - Bluetooth app mockup
----------------------------------------------------------------- */
function Gauge({ value, max, label, unit }) {
  const R = 70, C = 2 * Math.PI * R;
  const pct = Math.min(value / max, 1);
  return (
    <svg className="ph-gauge" viewBox="0 0 168 168">
      <circle cx="84" cy="84" r={R} fill="none" stroke="rgba(20,120,120,.12)" strokeWidth="13" />
      <circle cx="84" cy="84" r={R} fill="none" stroke="url(#gg)" strokeWidth="13" strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 84 84)"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }} />
      <defs>
        <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--teal-500)" /><stop offset="1" stopColor="var(--teal-700)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
function Spark({ up }) {
  const pts = up ? "0,18 12,14 24,16 36,9 48,11 60,4 72,6"
                 : "0,6 12,9 24,5 36,12 48,10 60,16 72,14";
  return (
    <svg className="ph-card-spark spark" viewBox="0 0 72 22" preserveAspectRatio="none" style={{ width: "100%" }}>
      <polyline points={pts} fill="none" stroke="var(--teal-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dashboard() {
  const [tds, setTds] = uS3(11);
  uE3(() => {
    const id = setInterval(() => setTds(9 + Math.floor(Math.random() * 6)), 2600);
    return () => clearInterval(id);
  }, []);
  const feats = [
    { ico: "bt", h: "Bluetooth-verbinding", p: "Koppel de Blue Compagnion-app en lees TDS, H₂-concentratie en ORP (−400/−600 mV) rechtstreeks van je kraan af." },
    { ico: "gauge", h: "Live waterkwaliteit", p: "Realtime metingen tonen exact hoe zuiver en hoe waterstofrijk je water op dit moment is." },
    { ico: "recycle", h: "Filter-levenscyclus", p: "Een digitale ID houdt je 12-maandelijkse filterbeurt bij en seint op tijd je installateur in." },
  ];
  return (
    <section className="section bg-paper2" id="dashboard">
      <div className="wrap">
        <div className="dash-grid">
          <div>
            <p className="eyebrow">04 - Wellness-dashboard</p>
            <h2 className="display" style={{ fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Je water,<br />in cijfers.</h2>
            <p className="lead" style={{ marginTop: 18 }}>De Blue Compagnion-app maakt het onzichtbare zichtbaar. Volg de kwaliteit van elk glas, kalibreer je ORP-waarden en plan onderhoud - alles vanaf je telefoon.</p>
            <div className="feature-list">
              {feats.map((f, i) => {
                const I = Ico[f.ico];
                return (
                  <div className="feature-row" key={i}>
                    <span className="fi"><I width="22" height="22" /></span>
                    <div><h4>{f.h}</h4><p>{f.p}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="phone">
            <span className="notch" />
            <div className="screen">
              <div className="ph-top">
                <span className="h">Blue Compagnion</span>
                <span className="live"><span className="d" /> LIVE</span>
              </div>
              <div className="ph-ring">
                <div style={{ position: "relative" }}>
                  <Gauge value={100 - tds} max={100} />
                  <div className="num"><b>{String(tds).padStart(3, "0")}</b><small>TDS · ppm</small></div>
                </div>
              </div>
              <div className="ph-cards">
                <div className="ph-card">
                  <div className="k">Waterstof H₂</div>
                  <div className="v">1480 <span>ppb</span></div>
                  <Spark up />
                </div>
                <div className="ph-card">
                  <div className="k">ORP</div>
                  <div className="v">−512 <span>mV</span></div>
                  <Spark />
                </div>
                <div className="ph-card">
                  <div className="k">pH-waarde</div>
                  <div className="v">7,4</div>
                </div>
                <div className="ph-card">
                  <div className="k">Filter</div>
                  <div className="v">214 <span>dagen</span></div>
                </div>
              </div>
              <button className="ph-btn">Kalibreer ORP</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   DE KRAAN - finish configurator
----------------------------------------------------------------- */
const FINISHES = {
  steel:  { name: "Geborsteld staal", img: "assets/finish-steel.webp",  dot: "linear-gradient(135deg,#cfd3d6,#9aa0a4)" },
  chrome: { name: "Chroom",           img: "assets/finish-chrome.webp", dot: "linear-gradient(135deg,#f1f4f6,#aeb6bd 60%,#7d858c)" },
  black:  { name: "Mat zwart",        img: "assets/finish-black.webp",  dot: "linear-gradient(135deg,#3a3a3c,#101012)" },
  gold:   { name: "Geborsteld goud",  img: "assets/finish-gold.webp",   dot: "linear-gradient(135deg,#e2c578,#b48a3c)" },
};
const FINISH_ORDER = ["steel", "chrome", "black", "gold"];
const KSPECS = [
  ["Bediening", "Hendel opzij"], ["Activatie", "Sensor touchless"],
  ["Aansluiting", "3/8\""], ["Doorvoer", "21 mm"],
];

function DeKraan({ finish, setFinish }) {
  const [swapping, setSwapping] = uS3(false);
  const cur = FINISHES[finish] || FINISHES.steel;
  const pick = (k) => {
    if (k === finish) return;
    setSwapping(true);
    setTimeout(() => { setFinish(k); setSwapping(false); }, 220);
  };
  return (
    <section className="section kraan" id="kraan">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">05 - De kraan</p>
          <h2 className="display">Vier finishes.<br />Eén statement.</h2>
          <p className="lead">Dezelfde strakke designkraan met sensorbediening - afgewerkt in de toon van jouw keuken. Kies je finish en zie het direct.</p>
        </div>
        <div className="kraan-grid">
          <div className="kraan-stage">
            <div className="frame">
              <img src={cur.img} alt={"VitaTap-kraan in " + cur.name} className={swapping ? "swapping" : ""} width="760" height="1140" loading="lazy" decoding="async" />
            </div>
            <span className="finish-name">{cur.name}</span>
          </div>
          <div className="kraan-cfg">
            <div className="swatches">
              {FINISH_ORDER.map((k) => (
                <button key={k} className={"swatch" + (k === finish ? " active" : "")} onClick={() => pick(k)} aria-label={FINISHES[k].name}>
                  <span className="dot" style={{ background: FINISHES[k].dot }} />
                  <span className="nm">{FINISHES[k].name.split(" ").pop()}</span>
                  {k === "steel" && <span className="swatch-default">Standaard</span>}
                </button>
              ))}
            </div>
            <div className="kraan-specs">
              {KSPECS.map(([k, v]) => (
                <div className="kspec" key={k}><div className="k">{k}</div><div className="v">{v}</div></div>
              ))}
            </div>
            <div className="hero-actions" style={{ marginTop: 22 }}>
              <a className="btn btn-primary" href="#prijzen">Bestel in {cur.name.toLowerCase()} <Ico.arrow className="arr" width="18" height="18" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- lifestyle duo band ---- */
function Lifestyle() {
  return (
    <section className="section tight bg-paper">
      <div className="wrap">
        <div className="lifestyle">
          <div className="life-card">
            <img src="assets/kitchen-light.webp" alt="Familie in een lichte loft-keuken" width="820" height="1230" loading="lazy" decoding="async" />
            <span className="ov" />
            <div className="txt"><div className="k">Voor het hele gezin</div><h3>Elke dag</h3></div>
          </div>
          <div className="life-card">
            <img src="assets/kitchen-dark.webp" alt="Koppel in een moderne donkere keuken" width="820" height="1230" loading="lazy" decoding="async" />
            <span className="ov" />
            <div className="txt"><div className="k">Design dat past</div><h3>In elke keuken</h3></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   WAARBORGEN - honest risk-reversal band
----------------------------------------------------------------- */
const GUARANTEES = [
  { ico: "check", h: "Gratis & vrijblijvend", p: "Advies zonder aankoopverplichting." },
  { ico: "shield", h: "14 dagen bedenktijd", p: "Wettelijk herroepingsrecht." },
  { ico: "recycle", h: "Alles inbegrepen", p: "Onderhoud & filters in je abonnement." },
  { ico: "clock", h: "Maandelijks opzegbaar", p: "Met het maandplan, geen verrassingen." },
];

function Waarborgen() {
  return (
    <section className="section tight waarborgen">
      <div className="wrap">
        <div className="waarborg-grid">
          {GUARANTEES.map((g, i) => {
            const I = Ico[g.ico];
            return (
              <div className="waarborg" key={i}>
                <span className="wi"><I width="24" height="24" /></span>
                <div><h4>{g.h}</h4><p>{g.p}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Dashboard, DeKraan, Lifestyle, Waarborgen });
