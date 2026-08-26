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
    desc: "Een SPE-cel (Solid Polymer Electrolysis) verrijkt het water met opgeloste moleculaire waterstof (H₂)." },
  { name: "UV-sterilisatie", sub: "100% sterilisatie", tag: "UV-C lamp", purity: 100,
    desc: "Een ingebouwde UV-C-lamp steriliseert het water als laatste stap: bacteriën en virussen worden 100% geëlimineerd zonder chemicaliën, geur of bijsmaak." },
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
              <img src="assets/finish-steel.webp" alt="VitaTap-designkraan in geborsteld staal met een aparte uitloop voor gezuiverd, vitaal water" width="760" height="1140" loading="lazy" decoding="async" />
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
  { ico: "bolt", h: "Moleculaire waterstof erin", p: "De SPE-cel (Solid Polymer Electrolysis) genereert opgeloste H₂, een klein molecuul dat neutrale watermoleculen en mineralen ongemoeid laat.",
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
            <p className="lead" style={{ marginTop: 18 }}>Zuiveren is stap één. Het verschil zit in wat we daarna toevoegen: mineralen die je lichaam herkent en opgeloste moleculaire waterstof. Meetbaar in elke druppel.</p>
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
          <p className="qt">Wat je lichaam terugvraagt: schoon water, herkenbare mineralen en opgeloste waterstof. VitaTap houdt PFAS, microplastics en bacteriën tot 99,9% tegen, reduceert de opgeloste stoffen met 95% en steriliseert daarna met UV-C. Vers en vitaal aan de uitloop.</p>
          <a className="btn btn-ghost" href="#kraan" style={{ color: "#fff", borderColor: "rgba(255,255,255,.5)" }}>Bekijk de kraan</a>
        </div>
        <p className="claims-note">Verwijdering tot 99,9% verwijst naar specifieke verontreinigingen (PFAS, microplastics, lood, bacteriën en virussen) volgens fabrikantsmetingen van het RO-membraan. De 95%-reductie van totaal opgeloste stoffen (TDS) is een gemiddelde fabrikantsmeting van datzelfde membraan. UV-sterilisatie elimineert bacteriën en virussen in het opslagtank-stadium. H₂-concentratie (1,2–1,6 ppm) en ORP-waarden (−400/−600 mV) zijn fabrikantspecificaties gemeten aan de uitloop. Wij doen geen gezondheids- of medische claims.</p>
      </div>
    </section>
  );
}

Object.assign(window, { Aanpak, Werking, Wetenschap });
