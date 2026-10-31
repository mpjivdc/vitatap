/* global React, Ico */
const { useState: useState2, useEffect: useEffect2 } = React;

/* ----------------------------------------------------------------
   AANPAK - interactive 6-step molecular reverse osmosis
----------------------------------------------------------------- */
const STEPS = [
  { name: "Sediment-voorfilter", sub: "Grove deeltjes & roest", tag: "5 µm",
    desc: "Zand, roestdeeltjes en zwevend vuil worden als eerste afgevangen, zodat de fijnere filters optimaal blijven presteren." },
  { name: "Actieve-koolblok", sub: "Chloor, smaak & geur", tag: "Chloor −99%",
    desc: "Een geperst koolblok bindt organische stoffen en geurtjes en vermindert chloor met 99%: de basis voor een neutrale, zuivere smaak." },
  { name: "RO-membraan", sub: "Filtratie op moleculaire schaal", tag: "0,0001 µm",
    desc: "Het hart van het systeem: een halfdoorlatend RO-membraan filtert op moleculaire schaal, onder meer deeltjes en opgeloste stoffen. Een aparte waterstroom voert de tegengehouden stoffen af." },
  { name: "Remineralisatie", sub: "Calcium & magnesium terug", tag: "Ca · Mg",
    desc: "Het gezuiverde water krijgt calcium en magnesium terug. Zo smaakt het zacht en rond, niet vlak." },
  { name: "SPE Waterstof-infusie", sub: "Moleculaire H₂ via SPE", tag: "1200–1600 ppb",
    desc: "Een SPE-cel (Solid Polymer Electrolysis) voegt 1.200 tot 1.600 ppb opgeloste moleculaire waterstof (H₂) toe, bij een ORP van −400 tot −600 mV." },
  { name: "UV-behandeling", sub: "Microbiologische stap", tag: "UV-C · 7 W",
    desc: "Een ingebouwde UV-C-lamp (7 W) in het voorraadvat is een extra microbiologische behandelingsstap na de RO. Correct gebruik en tijdig onderhoud (jaarlijkse lamp) blijven nodig." },
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
          <h2 className="display">Van leidingwater<br />tot glas.</h2>
          <p className="lead">Omgekeerde osmose filtert op moleculaire schaal. Daarna krijgt het water calcium en magnesium terug, voor de smaak. Ontdek elke stap.</p>
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
                {/* Step progress, not a purity percentage (no % claims without supplier evidence, R2/R3). */}
                <div className="bar"><div className="fill" style={{ width: Math.round((active + 1) / STEPS.length * 100) + "%" }} /></div>
                <div className="lab"><span>Zuiveringsstap</span><span>{active + 1} van {STEPS.length}</span></div>
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
  { ico: "waves", h: "Eén kraan, twee stromen", p: "Een aparte uitloop levert gezuiverd water, naast je gewone leidingwater. Gezuiverd om te drinken en te koken, gewoon voor de afwas." },
  { ico: "drop", h: "Sensorbediening, touchless", p: "Een geïntegreerde sensor activeert de stroom. Zo bedien je de kraan hygiënisch met de rug van je hand, ook met volle handen." },
  { ico: "wrench", h: "Past op je bestaande kraan", p: "De kraan past in de bestaande kraanopening (21 mm) met standaard 3/8\"-aansluiting. Een VitaTap-installateur plaatst alles in ongeveer 30 minuten, volgens checklist en nazicht." },
];

function Werking() {
  return (
    <section className="section bg-paper2" id="werking">
      <div className="wrap">
        <div className="werking-grid">
          <div className="werking-visual">
            <div className="werking-faucet">
              <img src="assets/finish-steel.webp" alt="VitaTap-designkraan in geborsteld staal met een aparte uitloop voor gezuiverd water" width="760" height="1140" loading="lazy" decoding="async" />
            </div>
            <div className="werking-filter">
              <img src="assets/under-sink-filter.webp" alt="Het 6-staps zuiveringssysteem onder de gootsteen" width="900" height="900" loading="lazy" decoding="async" />
              <span className="cap">Onder de gootsteen</span>
            </div>
          </div>
          <div className="werking-copy">
            <p className="eyebrow">02 · Werking</p>
            <h2 className="display" style={{ fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Slimme techniek.<br />Strakke kraan.</h2>
            <p className="lead" style={{ marginTop: 18 }}>Alle techniek verdwijnt in je onderkast. Boven blijft alleen een strakke designkraan die twee soorten water levert: gewoon leidingwater en gezuiverd drinkwater.</p>
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
  { ico: "shield", h: "RO als kernstap", p: "Het RO-membraan is de kernstap van de zuivering. Stofcategorieën zoals PFAS en microplastics worden in deze technologie genoemd als deeltjes en opgeloste stoffen die zo'n membraan kan tegenhouden. Dat is uitleg over de techniek, geen gemeten VitaTap-percentage per stof.",
    k: "Poriegrootte membraan", big: "0,0001 µm" },
  { ico: "bolt", h: "Moleculaire waterstof erin", p: "De SPE-cel (Solid Polymer Electrolysis) genereert opgeloste H₂, een klein molecuul dat neutrale watermoleculen en mineralen ongemoeid laat.",
    k: "Opgeloste waterstof", big: "1200–1600 ppb" },
  { ico: "spark", h: "UV-behandeling: microbiologische stap", p: "UV-C bewaakt het water in het voorraadvat als laatste barrière na filtratie. Geen chemicaliën, geen bijsmaak.",
    k: "UV-behandeling", big: "UV-C" },
];

function Wetenschap() {
  return (
    <section className="section bg-paper" id="wetenschap">
      <div className="wrap">
        <div className="sci-feature">
          <div className="sci-shot">
            <img src="assets/dark-teal-pour.webp" alt="Water met opgeloste waterstof en micro-bubbels stroomt uit de VitaTap-kraan" width="1000" height="1501" loading="lazy" decoding="async" />
            <span className="tag">Microbubbels · moleculaire H₂</span>
          </div>
          <div className="sec-head">
            <p className="eyebrow">03 · Wetenschap</p>
            <h2 className="display" style={{ fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Zuiveren. Aanvullen. Bewaken.</h2>
            <p className="lead" style={{ marginTop: 18 }}>Eerst filtert het RO-membraan het water. Daarna krijgt het calcium en magnesium terug en voegt een SPE-cel opgeloste waterstof toe. Een UV-C-lamp bewaakt het voorraadvat.</p>
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
          <p className="qt">Geen flessen meer kopen, sleuren of wegbrengen. Gewoon de kraan open: gefilterd met een RO-membraan, met mineralen voor de smaak en een UV-C-stap in het voorraadvat. Vers getapt, elke keer.</p>
          <a className="btn btn-ghost" href="#kraan" style={{ color: "#fff", borderColor: "rgba(255,255,255,.5)" }}>Bekijk de kraan</a>
        </div>
        <p className="claims-note">PFAS en microplastics zijn stofcategorieën die RO-technologie kan tegenhouden; wij vermelden voor VitaTap geen verwijderingspercentage per stof. Over TDS (een somparameter) lees je meer in de FAQ. UV-C in het voorraadvat is een extra behandelingsstap, geen belofte van steriel water. De elektrolysecel levert 1,2–1,6 ppm opgeloste waterstof bij een ORP van −400 tot −600 mV. Wij doen geen gezondheids- of medische claims.</p>
      </div>
    </section>
  );
}

Object.assign(window, { Aanpak, Werking, Wetenschap });
