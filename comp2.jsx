/* global React, Ico */
const { useState: useState2, useEffect: useEffect2 } = React;

/* ----------------------------------------------------------------
   AANPAK — interactive 6-step molecular reverse osmosis
----------------------------------------------------------------- */
const STEPS = [
  { name: "Sediment-voorfilter", sub: "Grove deeltjes & roest", tag: "5 µm", purity: 28,
    desc: "Zand, roestdeeltjes en zwevend vuil worden als eerste afgevangen, zodat de fijnere filters optimaal blijven presteren." },
  { name: "Actieve-koolblok", sub: "Chloor, smaak & geur", tag: "Carbon", purity: 52,
    desc: "Een geperst koolblok bindt chloor, organische stoffen en geurtjes — de basis voor een neutrale, zuivere smaak." },
  { name: "RO-membraan", sub: "PFAS · virussen · microplastics", tag: "0,0001 µm", purity: 96,
    desc: "Het hart van het systeem: een halfdoorlatend membraan houdt bacteriën, virussen, PFAS, microplastics en zware metalen tegen. Verwijdert gemiddeld ~97% van opgeloste vaste stoffen." },
  { name: "Remineralisatie", sub: "Calcium & magnesium terug", tag: "pH 7,2–7,8", purity: 97,
    desc: "Zuiver water krijgt bewust calcium en magnesium terug en wordt in pH gebalanceerd — precies wat je lichaam terugvraagt." },
  { name: "SPE Waterstof-infusie", sub: "Moleculaire H₂ via SPE", tag: "1200–1600 ppb", purity: 99,
    desc: "Een SPE-cel (Solid Polymer Electrolysis) verrijkt het water met opgeloste moleculaire waterstof — een kleine, selectieve antioxidant." },
  { name: "UV-sterilisatie", sub: "100% sterilisatie", tag: "UV-C lamp", purity: 100,
    desc: "Een ingebouwde UV-C-lamp steriliseert het water als laatste stap: bacteriën en virussen worden 100% geëlimineerd zonder chemicaliën, geur of bijsmaak." },
];

/* ---- schematic line-art per zuiveringsstap (leesbaar voor de leek) ---- */
const ART_P = { stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
const ART_T = { fill: "currentColor", stroke: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: "10", textAnchor: "middle", opacity: ".9" };
const STEP_ART = [
  /* 01 — zeef: vuil water in, zand & roest blijft achter, schoon water door */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <text x="42" y="20" {...ART_T}>zand &amp; roest</text>
      <path d="M6 58h26" strokeWidth="2" />
      <path d="M42 40l7 3-1 8-9 2-3-7 6-6Z" fill="currentColor" stroke="none" opacity=".85" />
      <circle cx="57" cy="70" r="4.5" fill="currentColor" stroke="none" opacity=".7" />
      <circle cx="38" cy="82" r="3" fill="currentColor" stroke="none" opacity=".55" />
      <path d="M75 26v70" strokeWidth="2.6" />
      <path d="M69 34h12M69 48h12M69 62h12M69 76h12M69 90h12" strokeWidth="1.5" opacity=".65" />
      <path d="M88 58h52m0 0-8-8m8 8-8 8" strokeWidth="2" />
    </svg>
  ),
  /* 02 — koolblok: chloor & geur blijven aan het blok plakken */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <text x="38" y="20" {...ART_T}>chloor &amp; geur</text>
      <path d="M6 58h22" strokeWidth="2" />
      <rect x="64" y="26" width="34" height="70" rx="9" strokeWidth="2.2" />
      <path d="M70 42l12-9M70 60l21-15M70 78l25-18M76 92l19-14" strokeWidth="1.4" opacity=".55" />
      <circle cx="50" cy="46" r="3" fill="currentColor" stroke="none" opacity=".8" />
      <circle cx="58" cy="64" r="2.5" fill="currentColor" stroke="none" opacity=".7" />
      <circle cx="46" cy="78" r="2" fill="currentColor" stroke="none" opacity=".55" />
      <path d="M40 46h6M48 64h6M36 78h6" strokeWidth="1.2" opacity=".5" />
      <path d="M106 58h36m0 0-8-8m8 8-8 8" strokeWidth="2" />
    </svg>
  ),
  /* 03 — RO-membraan: grote vervuilers geblokt, alleen water door de porie */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <text x="44" y="16" {...ART_T} fontSize="9.5">PFAS · virussen</text>
      <path d="M78 24v24M78 58v36" strokeWidth="2.8" />
      <circle cx="58" cy="38" r="9" strokeWidth="2.2" />
      <circle cx="54" cy="74" r="6.5" strokeWidth="2" />
      <circle cx="70" cy="53" r="2" fill="currentColor" stroke="none" opacity=".9" />
      <circle cx="87" cy="53" r="2" fill="currentColor" stroke="none" opacity=".9" />
      <path d="M94 53h44m0 0-8-8m8 8-8 8" strokeWidth="2" />
      <text x="114" y="76" {...ART_T} fontSize="9.5" opacity=".75">alleen water</text>
    </svg>
  ),
  /* 04 — remineralisatie: Ca en Mg gaan terug in de druppel */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <circle cx="28" cy="38" r="13" strokeWidth="2" />
      <text x="28" y="42" {...ART_T}>Ca</text>
      <path d="M44 38h22m0 0-7-7m7 7-7 7" strokeWidth="2" />
      <circle cx="28" cy="76" r="13" strokeWidth="2" />
      <text x="28" y="80" {...ART_T}>Mg</text>
      <path d="M44 76h20m0 0-7-7m7 7-7 7" strokeWidth="2" />
      <path d="M100 16c13 17 23 26 23 40a23 23 0 1 1-46 0c0-14 10-23 23-40Z" strokeWidth="2.2" />
      <path d="M92 60h16M100 52v16" strokeWidth="2.2" />
    </svg>
  ),
  /* 05 — H₂-infusie: glas water bruist van de waterstofbubbels */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      <path d="M52 24v58a10 10 0 0 0 10 10h26a10 10 0 0 0 10-10V24" strokeWidth="2.2" />
      <path d="M52 38c5 0 7-4 11.5-4s6.5 4 11.5 4 7-4 11.5-4 6.5 4 11.5 4" strokeWidth="1.7" opacity=".8" />
      <circle cx="64" cy="80" r="3" strokeWidth="1.6" />
      <circle cx="86" cy="76" r="2.2" strokeWidth="1.6" />
      <circle cx="64" cy="52" r="2" strokeWidth="1.6" />
      <circle cx="86" cy="50" r="2.5" strokeWidth="1.6" />
      <circle cx="75" cy="64" r="10.5" strokeWidth="2" />
      <text x="75" y="68" {...ART_T}>H₂</text>
      <path d="M112 44h8M116 40v8M120 64h7M30 56h8M34 52v8" strokeWidth="1.5" opacity=".5" />
    </svg>
  ),
  /* 06 — UV-sterilisatie: UV-lamp in de tank doodt bacteriën */
  () => (
    <svg viewBox="0 0 150 110" {...ART_P}>
      {/* tank */}
      <rect x="30" y="50" width="90" height="50" rx="8" strokeWidth="2.2" />
      {/* UV lamp tube */}
      <rect x="62" y="22" width="26" height="36" rx="13" strokeWidth="2.2" />
      {/* rays */}
      <path d="M75 16v-8M58 20l-6-6M92 20l6-6M52 34h-8M106 34h-8" strokeWidth="1.6" opacity=".75" />
      {/* UV label */}
      <text x="75" y="44" {...ART_T}>UV-C</text>
      {/* bubbles/sterilisation in water */}
      <circle cx="55" cy="72" r="3" strokeWidth="1.6" opacity=".7" />
      <circle cx="75" cy="78" r="2" strokeWidth="1.6" opacity=".6" />
      <circle cx="95" cy="68" r="2.5" strokeWidth="1.6" opacity=".7" />
      <text x="75" y="100" {...ART_T}>100% steriel</text>
    </svg>
  ),
];

function Aanpak() {
  const [active, setActive] = useState2(2);
  const s = STEPS[active];
  return (
    <section className="section bg-paper" id="aanpak">
      <Ico.drop className="watermark" style={{ width: 420, height: 420, top: -60, right: -80 }} />
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">01 — De aanpak</p>
          <h2 className="display">Zes stappen.<br />Eén glas perfectie.</h2>
          <p className="lead">Moleculaire omgekeerde osmose verwijdert vrijwel alles wat niet in je glas thuishoort — en bouwt daarna bewust weer op wat wél bijdraagt. Klik door elke stap.</p>
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
   WERKING — system overview
----------------------------------------------------------------- */
const WERK = [
  { ico: "filter", h: "Onzichtbaar onder de gootsteen", p: "Het complete 6-staps systeem zit compact weggewerkt in je onderkast. Geen werkbladtoestellen, geen flessen — alleen je kraan." },
  { ico: "waves", h: "Eén kraan, twee stromen", p: "Een aparte uitloop levert gezuiverd én vitaal water, naast je gewone leidingwater. Kies bewust wat er in je glas komt." },
  { ico: "drop", h: "Sensorbediening, touchless", p: "Een geïntegreerde sensor activeert de stroom — hygiënisch bedienen met de rug van je hand, ook met volle handen." },
  { ico: "wrench", h: "Past op je bestaande kraan", p: "De kraan past in de bestaande kraanopening (21 mm) met standaard 3/8\"-aansluiting. Een erkende installateur plaatst alles in ongeveer 30 minuten." },
];

function Werking() {
  return (
    <section className="section bg-paper2" id="werking">
      <div className="wrap">
        <div className="werking-grid">
          <div className="werking-visual">
            <div className="werking-faucet">
              <img src="assets/faucet-annotated.png" alt="VitaTap-kraan met aparte uitloop voor gezuiverd, vitaal water en gewoon leidingwater" />
            </div>
            <div className="werking-filter">
              <img src="assets/under-sink-filter.png" alt="Het 6-staps zuiveringssysteem onder de gootsteen" />
              <span className="cap">Onder de gootsteen</span>
            </div>
          </div>
          <div className="werking-copy">
            <p className="eyebrow">02 — Werking</p>
            <h2 className="display" style={{ fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Slimme techniek.<br />Strakke kraan.</h2>
            <p className="lead" style={{ marginTop: 18 }}>Alle techniek verdwijnt in je onderkast. Boven blijft alleen een strakke designkraan die twee soorten water levert — gewoon en gezuiverd-vitaal.</p>
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
   WETENSCHAP — the science
----------------------------------------------------------------- */
const SCI = [
  { ico: "shield", h: "PFAS & microplastics eruit", p: "Het RO-membraan houdt 'forever chemicals', microplastics, lood en nitraten tegen. Gemiddeld ~97% verwijdering van opgeloste vaste stoffen; bacteriën en virussen worden nagenoeg volledig gestopt.",
    k: "TDS-reductie", big: "~97%" },
  { ico: "bolt", h: "Moleculaire waterstof erin", p: "De SPE-cel (Solid Polymer Electrolysis) genereert opgeloste H₂ — een kleine, selectieve antioxidant die neutrale watermoleculen en mineralen ongemoeid laat.",
    k: "Concentratie H₂", big: "1200–1600 ppb" },
  { ico: "spark", h: "UV-sterilisatie: 100% zuiver", p: "Een ingebouwde UV-C-lamp doodt in de laatste stap alle resterende bacteriën en virussen — zonder chemicaliën, zonder bijsmaak.",
    k: "UV-sterilisatie", big: "100%" },
];

function Wetenschap() {
  return (
    <section className="section bg-paper" id="wetenschap">
      <div className="wrap">
        <div className="sci-feature">
          <div className="sci-shot">
            <img src="assets/dark-teal-pour.png" alt="Waterstofrijk water met micro-bubbels stroomt uit de VitaTap-kraan" />
            <span className="tag">Micro-bubbels · moleculaire H₂</span>
          </div>
          <div className="sec-head">
            <p className="eyebrow">03 — Wetenschap</p>
            <h2 className="display" style={{ fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Niet zomaar zuiver. Vitaal.</h2>
            <p className="lead" style={{ marginTop: 18 }}>Zuiveren is stap één. Het verschil zit in wat we daarna toevoegen: mineralen die je lichaam herkent en moleculaire waterstof die als antioxidant werkt — meetbaar in elke druppel.</p>
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
          <p className="qt">Wat je lichaam terugvraagt: schoon water, herkenbare mineralen en een antioxidante lading. VitaTap zuivert tot 97% van opgeloste stoffen en steriliseert daarna met UV-C — vers en vitaal aan de uitloop.</p>
          <a className="btn btn-ghost" href="#kraan" style={{ color: "#fff", borderColor: "rgba(255,255,255,.5)" }}>Bekijk de kraan</a>
        </div>
        <p className="claims-note">~97%-reductie van opgeloste vaste stoffen (TDS) is een gemiddelde fabrikantsmeting van het RO-membraan. UV-sterilisatie elimineert bacteriën en virussen in het opslagtank-stadium. H₂-concentratie (1,2–1,6 ppm) en ORP-waarden (−400/−600 mV) zijn fabrikantspecificaties gemeten aan de uitloop. Verwijzingen naar antioxidante eigenschappen beschrijven algemene kenmerken van moleculaire waterstof — geen medische of gezondheidsclaims.</p>
      </div>
    </section>
  );
}

Object.assign(window, { Aanpak, Werking, Wetenschap });
