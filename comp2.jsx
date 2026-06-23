/* global React, Ico */
const { useState: useState2, useEffect: useEffect2 } = React;

/* ----------------------------------------------------------------
   AANPAK - interactive 6-step molecular reverse osmosis
----------------------------------------------------------------- */
const STEPS = [
  { name: "Sediment-voorfilter", sub: "Grove deeltjes & roest", tag: "5 µm", purity: 28,
    desc: "Zand, roestdeeltjes en zwevend vuil worden als eerste afgevangen, zodat de fijnere filters optimaal blijven presteren." },
  { name: "Actieve-koolblok", sub: "Chloor, smaak & geur", tag: "Carbon", purity: 52,
    desc: "Een geperst koolblok bindt chloor, organische stoffen en geurtjes, de basis voor een neutrale, zuivere smaak." },
  { name: "RO-membraan", sub: "PFAS · virussen · microplastics", tag: "0,0001 µm", purity: 96,
    desc: "Het hart van het systeem: een halfdoorlatend membraan houdt bacteriën, virussen, PFAS, microplastics en zware metalen tot 99,9% tegen. De gemiddelde TDS-reductie (totaal opgeloste stoffen) bedraagt 95%." },
  { name: "Remineralisatie", sub: "Calcium & magnesium terug", tag: "pH 7,2–7,8", purity: 97,
    desc: "Zuiver water krijgt bewust calcium en magnesium terug en wordt in pH gebalanceerd. Precies wat je lichaam terugvraagt." },
  { name: "SPE Waterstof-infusie", sub: "Moleculaire H₂ via SPE", tag: "1200–1600 ppb", purity: 99,
    desc: "Een SPE-cel (Solid Polymer Electrolysis) verrijkt het water met opgeloste moleculaire waterstof, een kleine en selectieve antioxidant." },
  { name: "UV-sterilisatie", sub: "100% sterilisatie", tag: "UV-C lamp", purity: 100,
    desc: "Een ingebouwde UV-C-lamp steriliseert het water als laatste stap: bacteriën en virussen worden 100% geëlimineerd zonder chemicaliën, geur of bijsmaak." },
];

/* ---- schematic line-art per zuiveringsstap (leesbaar voor de leek) ---- */
const ART_P = { stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
const ART_T = { fill: "currentColor", stroke: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: "10", textAnchor: "middle", opacity: ".9" };
const STEP_ART = [
  /* 01 sediment: funnel catches coarse particles */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <circle cx="60" cy="24" r="5" fill="currentColor" stroke="none" opacity=".9" />
      <circle cx="80" cy="17" r="4" fill="currentColor" stroke="none" opacity=".7" />
      <circle cx="93" cy="26" r="3.5" fill="currentColor" stroke="none" opacity=".55" />
      <path d="M42 38 H108 L83 68 V85 H67 V68 Z" strokeWidth="3" />
      <path d="M75 92 C68 102 68 105 75 105 C82 105 82 102 75 92 Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  /* 02 carbon block: water passes through, chlorine and odour bound */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <path d="M14 55 H42" strokeWidth="3" />
      <rect x="54" y="30" width="42" height="50" rx="8" strokeWidth="3" />
      <path d="M61 45 l12 -11 M61 59 l20 -17 M61 73 l27 -22 M72 80 l16 -13" strokeWidth="1.6" opacity=".45" />
      <path d="M108 55 H136 m0 0 -8 -7 m8 7 -8 7" strokeWidth="3" />
    </svg>
  ),
  /* 03 RO membrane: large contaminants blocked, water passes */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <path d="M72 20 V90" strokeWidth="3" />
      <circle cx="48" cy="40" r="11" strokeWidth="2.6" />
      <circle cx="45" cy="72" r="8" strokeWidth="2.4" />
      <path d="M82 55 H132 m0 0 -8 -7 m8 7 -8 7" strokeWidth="3" />
      <circle cx="98" cy="43" r="2.5" fill="currentColor" stroke="none" opacity=".85" />
      <circle cx="112" cy="67" r="2.5" fill="currentColor" stroke="none" opacity=".7" />
    </svg>
  ),
  /* 04 remineralisation: minerals added back to the drop */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <path d="M75 18 C56 44 47 57 47 71 a28 28 0 0 0 56 0 c0 -14 -9 -27 -28 -53 Z" strokeWidth="3" />
      <path d="M66 71 H84 M75 62 V80" strokeWidth="3.4" />
    </svg>
  ),
  /* 05 SPE hydrogen infusion: H2 dissolved with micro-bubbles */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <circle cx="75" cy="57" r="25" strokeWidth="3" />
      <text x="75" y="63" {...ART_T} fontSize="15">H₂</text>
      <circle cx="42" cy="40" r="4.5" strokeWidth="2" />
      <circle cx="111" cy="44" r="5.5" strokeWidth="2" />
      <circle cx="49" cy="82" r="3.5" strokeWidth="2" />
      <circle cx="107" cy="80" r="4" strokeWidth="2" />
    </svg>
  ),
  /* 06 UV sterilisation: UV-C lamp neutralises microbes */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <rect x="63" y="22" width="24" height="46" rx="12" strokeWidth="3" />
      <text x="75" y="52" {...ART_T} fontSize="11">UV</text>
      <path d="M75 14 V6 M99 28 l7 -6 M51 28 l-7 -6 M106 48 h8 M44 48 h-8" strokeWidth="2.4" opacity=".85" />
      <path d="M56 86 H94" strokeWidth="3" opacity=".5" />
      <circle cx="64" cy="80" r="2.4" fill="currentColor" stroke="none" opacity=".55" />
      <circle cx="86" cy="80" r="2.4" fill="currentColor" stroke="none" opacity=".55" />
    </svg>
  ),
];

function Aanpak() {
  const [active, setActive] = useState2(0);
  const s = STEPS[active];
  return (
    <section className="section bg-paper" id="aanpak">
      <Ico.drop className="watermark" style={{ width: 420, height: 420, top: -60, right: -80 }} />
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">01 · De aanpak</p>
          <h2 className="display">Zes stappen.<br />Eén glas perfectie.</h2>
          <p className="lead">Moleculaire omgekeerde osmose verwijdert vrijwel alles wat niet in je glas thuishoort, en bouwt daarna bewust weer op wat wél bijdraagt. Ontdek elke stap.</p>
        </div>
        <div className="steps-layout">
          <div className="steps-sticky">
            <div className="flow-visual">
              <span className="ring" />
              <span className="flow-pill">Stap {String(active + 1).padStart(2, "0")} / 06</span>
              <div className="flow-head">
                <div className="flow-num">{String(active + 1).padStart(2, "0")}</div>
                <div className="flow-art" key={active}>{STEP_ART[active]()}</div>
              </div>
              <div className="flow-name">{s.name}</div>
              <p className="flow-desc">{s.desc}</p>
              <div className="flow-meter">
                <div className="bar"><div className="fill" style={{ width: s.purity + "%" }} /></div>
                <div className="lab"><span>Zuiverheid</span><span>{s.purity}%</span></div>
              </div>
            </div>
          </div>
          <div className="step-list">
            {STEPS.map((st, i) => (
              <button key={i} className={"step-item" + (i === active ? " active" : "")}
                onMouseEnter={() => setActive(i)} onClick={() => setActive(i)}>
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="st-name">{st.name}</span>
                  <span className="st-sub">{st.sub}</span>
                </span>
                <span className="st-tag">{st.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   WERKING - system overview
----------------------------------------------------------------- */
const WERK = [
  { ico: "filter", h: "Onzichtbaar onder de gootsteen", p: "Het complete 6-staps systeem zit compact weggewerkt in je onderkast. Geen werkbladtoestellen, geen flessen. Alleen je kraan." },
  { ico: "waves", h: "Eén kraan, twee stromen", p: "Een aparte uitloop levert gezuiverd én vitaal water, naast je gewone leidingwater. Kies bewust wat er in je glas komt." },
  { ico: "drop", h: "Sensorbediening, touchless", p: "Een geïntegreerde sensor activeert de stroom. Zo bedien je de kraan hygiënisch met de rug van je hand, ook met volle handen." },
  { ico: "wrench", h: "Past op je bestaande kraan", p: "De kraan past in de bestaande kraanopening (21 mm) met standaard 3/8\"-aansluiting. Een erkende installateur plaatst alles in ongeveer 30 minuten." },
];

function Werking() {
  return (
    <section className="section bg-paper2" id="werking">
      <div className="wrap">
        <div className="werking-grid">
          <div className="werking-visual">
            <div className="werking-faucet">
              <img src="assets/faucet-annotated.webp" alt="VitaTap-kraan met aparte uitloop voor gezuiverd, vitaal water en gewoon leidingwater" width="1000" height="1501" loading="lazy" decoding="async" />
            </div>
            <div className="werking-filter">
              <img src="assets/under-sink-filter.webp" alt="Het 6-staps zuiveringssysteem onder de gootsteen" width="900" height="900" loading="lazy" decoding="async" />
              <span className="cap">Onder de gootsteen</span>
            </div>
          </div>
          <div className="werking-copy">
            <p className="eyebrow">02 · Werking</p>
            <h2 className="display" style={{ fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Slimme techniek.<br />Strakke kraan.</h2>
            <p className="lead" style={{ marginTop: 18 }}>Alle techniek verdwijnt in je onderkast. Boven blijft alleen een strakke designkraan die twee soorten water levert: gewoon en gezuiverd-vitaal.</p>
            <div className="werk-steps">
              {WERK.map((w, i) => {
                const I = Ico[w.ico];
                return (
                  <div className="werk-step" key={i}>
                    <span className="n"><I width="20" height="20" /></span>
                    <div><h4>{w.h}</h4><p>{w.p}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   WETENSCHAP - the science
----------------------------------------------------------------- */
const SCI = [
  { ico: "shield", h: "PFAS & microplastics eruit", p: "Het RO-membraan houdt 'forever chemicals', microplastics, lood en nitraten tot 99,9% tegen; bacteriën en virussen worden nagenoeg volledig gestopt. De TDS-reductie (totaal opgeloste stoffen) bedraagt gemiddeld 95%.",
    k: "Verwijdering verontreinigingen", big: "tot 99,9%" },
  { ico: "bolt", h: "Moleculaire waterstof erin", p: "De SPE-cel (Solid Polymer Electrolysis) genereert opgeloste H₂, een kleine en selectieve antioxidant die neutrale watermoleculen en mineralen ongemoeid laat.",
    k: "Concentratie H₂", big: "1200–1600 ppb" },
  { ico: "spark", h: "UV-sterilisatie: 100% zuiver", p: "Een ingebouwde UV-C-lamp doodt in de laatste stap alle resterende bacteriën en virussen. Zonder chemicaliën, zonder bijsmaak.",
    k: "UV-sterilisatie", big: "100%" },
];

function Wetenschap() {
  return (
    <section className="section bg-paper" id="wetenschap">
      <div className="wrap">
        <div className="sci-feature">
          <div className="sci-shot">
            <img src="assets/dark-teal-pour.webp" alt="Waterstofrijk water met micro-bubbels stroomt uit de VitaTap-kraan" width="1000" height="1501" loading="lazy" decoding="async" />
            <span className="tag">Microbubbels · moleculaire H₂</span>
          </div>
          <div className="sec-head">
            <p className="eyebrow">03 · Wetenschap</p>
            <h2 className="display" style={{ fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Niet zomaar zuiver. Vitaal.</h2>
            <p className="lead" style={{ marginTop: 18 }}>Zuiveren is stap één. Het verschil zit in wat we daarna toevoegen: mineralen die je lichaam herkent en moleculaire waterstof die als antioxidant werkt. Meetbaar in elke druppel.</p>
          </div>
        </div>
        <div className="sci-grid">
          {SCI.map((c, i) => {
            const I = Ico[c.ico];
            return (
              <div className="sci-card" key={i}>
                <span className="ico"><I width="26" height="26" /></span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
                <div className="sci-metric"><span>{c.k}</span><span className="big">{c.big}</span></div>
              </div>
            );
          })}
        </div>
        <div className="callout">
          <div className="qi">“</div>
          <p className="qt">Wat je lichaam terugvraagt: schoon water, herkenbare mineralen en een antioxidante lading. VitaTap houdt PFAS, microplastics en bacteriën tot 99,9% tegen, reduceert de opgeloste stoffen met 95% en steriliseert daarna met UV-C. Vers en vitaal aan de uitloop.</p>
          <a className="btn btn-ghost" href="#kraan" style={{ color: "#fff", borderColor: "rgba(255,255,255,.5)" }}>Bekijk de kraan</a>
        </div>
        <p className="claims-note">Verwijdering tot 99,9% verwijst naar specifieke verontreinigingen (PFAS, microplastics, lood, bacteriën en virussen) volgens fabrikantsmetingen van het RO-membraan. De 95%-reductie van totaal opgeloste stoffen (TDS) is een gemiddelde fabrikantsmeting van datzelfde membraan. UV-sterilisatie elimineert bacteriën en virussen in het opslagtank-stadium. H₂-concentratie (1,2–1,6 ppm) en ORP-waarden (−400/−600 mV) zijn fabrikantspecificaties gemeten aan de uitloop. Verwijzingen naar antioxidante eigenschappen beschrijven algemene kenmerken van moleculaire waterstof, geen medische of gezondheidsclaims.</p>
      </div>
    </section>
  );
}

Object.assign(window, { Aanpak, Werking, Wetenschap });
