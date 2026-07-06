/* global React, Ico, Logo */
const { useState: uS4 } = React;

/* ----------------------------------------------------------------
   PRIJZEN
----------------------------------------------------------------- */
const COMMON = [
  "VitaTap-designkraan in jouw finish",
  "6-staps zuiveringssysteem onder de gootsteen",
  "Jaarlijks onderhoud inbegrepen",
  "12-maandelijkse filtervervanging inbegrepen",
  "Blue Companion-app & support",
];
const PLANS = [
  { key: "m", name: "Maandelijks", sub: "Maximale flexibiliteit", num: "65", incl: "78,65", per: "/ mnd",
    billing: "Maandelijks betaald · opzegbaar per maand", extra: "Maandelijks opzegbaar", featured: false },
  { key: "y", name: "Jaarlijks", sub: "Meest gekozen", num: "45", incl: "54,45", per: "/ mnd",
    billing: "Eén betaling van €540 per jaar", extra: "−31% t.o.v. maandelijks", featured: true, tag: "Populair" },
  { key: "5", name: "5-jaarlijks", sub: "Beste waarde", num: "39", incl: "47,19", per: "/ mnd",
    billing: "Eén betaling van €2.340 per 5 jaar", extra: "−40% · prijsgarantie 5 jaar", featured: false, tag: "Beste waarde" },
];

const WATER_BRANDS = [
  { key: "dl",  name: "Delhaize huismerk", priceL: 0.27 },
  { key: "spa", name: "Spa Reine",          priceL: 0.57 },
  { key: "vit", name: "Vittel",             priceL: 0.57 },
];
const VT_MONTH_INCL = 47.19; // 5-jarenplan €39/mnd excl. 21% btw

function fmt(n) { return n.toFixed(2).replace(".", ","); }

const VT_QUALITY = [
  "PFAS & microplastics verwijderd",
  "Geremineraliseerd (Ca, Mg)",
  "Moleculaire H₂, antioxidant",
  "UV-gesteriliseerd",
  "Geen plastic flessen",
  "Onbeperkt beschikbaar",
];
const BOTTLE_ML = 0.5; // 50cl referentiefles voor plastic teller

function LiterSim() {
  const [people, setPeople] = uS4(2);
  const LITERS_PER_PERSON = 4; // 2 l drinken + koffie, thee, koken
  const litersPerDay = people * LITERS_PER_PERSON;
  const litersPerMonth = litersPerDay * 30;
  const maxCost = Math.max(VT_MONTH_INCL, ...WATER_BRANDS.map(b => b.priceL * litersPerMonth));
  const bottlesPerYear = Math.round(litersPerDay * 365 / BOTTLE_ML);
  // premium referentie = gemiddelde van Spa Reine en Vittel
  const premiumBrands = WATER_BRANDS.filter(b => b.key === "spa" || b.key === "vit");
  const premiumMonthly = premiumBrands.reduce((s, b) => s + b.priceL * litersPerMonth, 0) / premiumBrands.length;
  const yearlySavings = (premiumMonthly - VT_MONTH_INCL) * 12;

  return (
    <div className="liter-compare">
      <div className="lc-head">Bereken jouw besparing</div>

      <div className="lc-controls">
        <div className="lc-sim-row">
          <span className="lc-sim-label">Personen in huis</span>
          <div className="lc-pills">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <button key={n} className={"lc-pill" + (people === n ? " active" : "")} onClick={() => setPeople(n)}>
                {n}
              </button>
            ))}
          </div>
          <span className="lc-usage">{litersPerDay}L/dag totaal</span>
        </div>
        <p className="lc-assumption">We rekenen met 4 liter per persoon per dag: ±2 liter drinkwater plus water voor koffie, thee en koken.</p>
      </div>

      <div className="lc-rows">
        <div className="lc-row vt">
          <span className="lc-name">VitaTap</span>
          <div className="lc-bar"><span style={{ width: Math.round(VT_MONTH_INCL / maxCost * 100) + "%" }}></span></div>
          <span className="lc-val">€{fmt(VT_MONTH_INCL)} / mnd†</span>
        </div>
        {WATER_BRANDS.map(b => {
          const monthly = b.priceL * litersPerMonth;
          const cheaper = monthly < VT_MONTH_INCL;
          return (
            <div key={b.key} className={"lc-row" + (cheaper ? " lc-cheaper" : "")}>
              <span className="lc-name">{b.name}</span>
              <div className="lc-bar"><span style={{ width: Math.round(monthly / maxCost * 100) + "%" }}></span></div>
              <span className="lc-val">€{fmt(monthly)} / mnd</span>
            </div>
          );
        })}
      </div>

      <div className="lc-insights">
        <div className="lc-insight">
          <span className="lc-insight-val">{bottlesPerYear.toLocaleString("nl-BE")}</span>
          <span className="lc-insight-lab">plastic flessen per jaar vermeden</span>
        </div>
        {yearlySavings > 0 ? (
          <div className="lc-insight lc-insight-win">
            <span className="lc-insight-val">€{fmt(yearlySavings)}</span>
            <span className="lc-insight-lab">bespaard per jaar t.o.v. premium flessenwater (gem. Spa Reine & Vittel)</span>
          </div>
        ) : (
          <div className="lc-insight lc-insight-neutral">
            <span className="lc-insight-val">{people}+ pers.</span>
            <span className="lc-insight-lab">meer personen, meer voordeel</span>
          </div>
        )}
        <div className="lc-insight">
          <span className="lc-insight-val">6-staps</span>
          <span className="lc-insight-lab">zuivering incl. PFAS, UV & H₂</span>
        </div>
      </div>

      <div className="lc-quality">
        {VT_QUALITY.map((q, i) => (
          <span key={i} className="lc-qtag"><Ico.check width="12" height="12" /> {q}</span>
        ))}
      </div>

      <p className="lc-note">
        †VitaTap 5-jarenplan · €39/mnd excl. 21% btw (€47,19 incl. btw) · vaste kost ongeacht verbruik · excl. eenmalige opstartkost €605 incl. btw.<br />
        Flessenwater: winkelprijs Delhaize.be juni 2026 (6×1,5 l), incl. 6% btw. Plastic: 1 fles = 50 cl. Prijzen kunnen variëren.
      </p>
    </div>
  );
}

function Prijzen() {
  return (
    <section className="section bg-paper" id="prijzen">
      <div className="wrap">
        <div className="sec-head" style={{ maxWidth: 820 }}>
          <p className="eyebrow">06 · Prijzen</p>
          <h2 className="display">Alles inbegrepen.<br />Altijd zuiver, altijd vitaal.</h2>
          <p className="lead">Onderhoud, filtervervanging en support zitten er standaard in. Kies de looptijd die bij je past. Hoe langer, hoe voordeliger.</p>
        </div>
        <div className="price-grid">
          {PLANS.map((p) => (
            <div key={p.key} className={"price-card" + (p.featured ? " featured" : "")}>
              {p.tag && <span className="price-tag">{p.tag}</span>}
              <div className="price-name">{p.name}</div>
              <div className="price-sub">{p.sub}</div>
              <div className="price-amount">
                <span className="cur">€</span><span className="num">{p.num}</span><span className="per">{p.per}</span>
              </div>
              <div className="price-incl">€{p.incl} / mnd incl. 21% btw</div>
              <div className="price-billing">{p.billing}</div>
              <ul className="price-feats">
                <li><Ico.check className="ck" /><span><strong>{p.extra}</strong></span></li>
                {COMMON.map((f, i) => <li key={i}><Ico.check className="ck" /><span>{f}</span></li>)}
              </ul>
              <div className="price-setup">+ <b>€500</b> opstartkost eenmalig<span className="ps-incl">€605 incl. btw</span></div>
              <a className={"btn " + (p.featured ? "btn-primary solid-white" : "btn-primary")} href="#contact"
                onClick={() => window.dispatchEvent(new CustomEvent("vt-plan", { detail: p.key }))}>
                Kies {p.name.toLowerCase()} <Ico.arrow className="arr" width="18" height="18" />
              </a>
            </div>
          ))}
        </div>
        <div className="startup-banner">
          <span><Ico.wrench className="ic" width="20" height="20" /> <span>Installatie door <b>erkende vakman</b> · opstartkost €500 eenmalig · betaling via Bancontact, overschrijving of domiciliëring</span></span>
          <span><Ico.recycle className="ic" width="20" height="20" /> Onderhoud &amp; filters inbegrepen</span>
          <span><Ico.shield className="ic" width="20" height="20" /> Prijzen excl. btw · incl. btw telkens vermeld</span>
        </div>
        <LiterSim />
        <p className="price-foot">Liever eerst advies? <a href="#contact" style={{ color: "var(--teal-700)", textDecoration: "underline" }}>Plan een gratis en vrijblijvend adviesgesprek →</a></p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   INSTALLATIE IN JOUW REGIO
----------------------------------------------------------------- */
const BE_PATH = "M254.314,47.545L263.578,52.099L271.578,53.074L275.368,51.123L272.842,39.732L279.579,33.868L286.737,30.935L290.106,35.823L296.843,40.709L302.317,41.035L316.634,28L319.582,30.609L322.951,35.172L323.372,38.755L324.214,42.663L327.161,44.29L338.531,43.639L344.005,36.475L348.637,31.913L352.005,35.172L353.69,43.639L356.637,55.025L370.112,67.694L381.481,71.264L395.377,68.668L400.851,66.396L404.641,68.343L408.01,75.157L416.01,82.613L432.854,88.12L438.328,91.034L441.696,96.213L440.854,103.651L432.854,121.734L431.59,127.216L432.854,128.828L431.169,132.373L420.642,144.285L419.8,148.788L423.169,155.539L426.116,161.32L432.433,164.21L438.328,165.173L449.276,165.494L461.066,165.815L462.751,169.344L475.804,178.963L480.015,186.651L489.7,194.331L481.699,203.603L482.963,208.075L485.91,212.226L496.437,214.78L501.912,220.841L502.333,230.403L504.438,245.68L482.542,261.248L476.225,278.056L475.804,281.54L474.962,280.907L472.436,275.521L468.225,275.521L459.382,272.985L446.328,288.505L440.433,301.153L437.065,310.627L432.012,318.2L431.169,326.08L431.59,329.545L429.906,333.954L429.906,338.36L437.065,347.166L439.17,352.193L448.013,367.887L445.065,373.843L442.96,379.795L440.433,384.491L437.486,387.308L428.222,386.995L416.431,388.872L408.431,392L404.22,392L395.798,384.178L386.534,372.589L380.218,366.946L377.692,361.927L370.112,360.044L359.585,354.078L352.005,347.794L345.689,343.707L336.846,341.82L329.688,342.135L327.161,331.435L326.319,319.146L320.424,310.943L328.846,278.689L323.793,275.521L318.319,278.056L310.739,285.973L306.949,295.147L304.844,303.049L291.79,310.627L271.157,313.468L248.84,310.627L245.471,308.733L244.208,306.523L244.208,303.681L245.471,299.257L249.682,293.882L250.524,286.289L246.313,279.956L243.787,277.422L245.05,271.083L247.998,263.153L248.419,258.708L233.26,244.726L222.311,242.181L211.363,241.863L203.363,240.272L198.731,240.909L195.362,244.726L191.572,247.588L189.046,244.09L184.414,219.884L180.624,216.375L166.728,212.226L148.201,210.63L143.148,206.159L140.2,195.291L138.516,182.167L132.199,169.344L129.252,166.136L123.778,160.678L113.672,162.926L101.881,170.307L95.144,172.231L92.196,173.193L82.932,165.815L72.405,154.575L63.984,142.676L61.878,135.916L64.405,127.861L61.457,121.734L56.825,110.436L55.562,101.711L106.513,70.291L137.252,54.05L151.99,49.171L155.359,65.422L158.307,70.615L161.675,73.86L166.307,74.508L171.36,70.615L178.94,66.396L190.73,68.343L199.573,72.238L202.52,76.13L208.416,80.021L216.416,80.993L232.839,73.535L248.419,62.499L252.63,54.7Z";
const PINS = [
  { n: "Brussel", l: 48.07, t: 35.1 },
  { n: "Antwerpen", l: 49.13, t: 18.76 },
  { n: "Gent", l: 34.82, t: 26.08 },
  { n: "Brugge", l: 24.53, t: 19.2 },
  { n: "Hasselt", l: 68.66, t: 31.55 },
  { n: "Luik", l: 73.72, t: 44.68 },
  { n: "Namen", l: 58.84, t: 51.92 },
  { n: "Charleroi", l: 50.01, t: 54.37 },
  { n: "Leuven", l: 55.35, t: 33.81 },
];
const HQ = { n: "Kortrijk", l: 25.37, t: 36.09 };

function Locator() {
  const [zip, setZip] = uS4("");
  const [shown, setShown] = uS4(false);
  const submit = (e) => { e.preventDefault(); if (zip.trim().length >= 4) setShown(true); };
  return (
    <section className="section locator" id="installateurs">
      <div className="wrap">
        <div className="loc-grid">
          <div>
            <p className="eyebrow on-dark">07 · Installatie in jouw regio</p>
            <h2 className="display" style={{ color: "#fff", fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Installatie bij jou thuis</h2>
            <p className="lead" style={{ color: "rgba(255,255,255,.88)", marginTop: 18 }}>Geef je postcode in en we bevestigen de plaatsing in jouw regio. Een erkende vakman, uit ons eigen team of een gecertificeerde partner, plaatst alles volgens het 30-minuten protocol en kalibreert via de Blue Companion-app.</p>
            <form className="loc-form" onSubmit={submit}>
              <input value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="Bv. 9000" aria-label="Postcode" maxLength="4" />
              <button className="btn btn-primary solid-white" type="submit">Check beschikbaarheid <Ico.arrow className="arr" width="18" height="18" /></button>
            </form>
            <p className="loc-note">Actief in heel België · plaatsing in ongeveer 30 minuten.</p>
            <div className="loc-results">
              {shown && (
                <div className="loc-confirm" role="status">
                  <span className="lc-ico"><Ico.check width="22" height="22" /></span>
                  <div className="lc-body">
                    <div className="lc-ti">Goed nieuws, we komen tot bij jou{zip.trim() ? " (" + zip.trim() + ")" : ""}.</div>
                    <p className="lc-tx">Laat je gegevens achter en we plannen samen een datum voor je gratis adviesgesprek en installatie.</p>
                    <a className="btn btn-primary solid-white" href="#contact">Plan mijn installatie <Ico.arrow className="arr" width="18" height="18" /></a>
                  </div>
                </div>
              )}
            </div>
            <p className="loc-partner">Ben je zelf installateur? <a href="#contact" onClick={() => window.dispatchEvent(new CustomEvent("vt-topic", { detail: "partner" }))}>Word erkende VitaTap-partner →</a></p>
          </div>
          <div className="loc-map" aria-hidden="true">
            <svg className="loc-be" viewBox="0 0 560 420" preserveAspectRatio="xMidYMid meet" focusable="false">
              <path d={BE_PATH} fill="rgba(255,255,255,.09)" stroke="rgba(255,255,255,.45)" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            {PINS.map((p, i) => (
              <span className="loc-pin" key={i} style={{ left: p.l + "%", top: p.t + "%" }} title={p.n}><span className="p" /></span>
            ))}
            <span className="loc-pin me" style={{ left: HQ.l + "%", top: HQ.t + "%" }} title={HQ.n}><span className="p" /></span>
            <span className="loc-map-cap">Eigen team + gecertificeerde partners · heel België</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   INSTALLER ONBOARDING
----------------------------------------------------------------- */
const INSTALL = [
  { ph: "01", ti: "Voorbereiding", p: "De bestaande kraanopening (21 mm) en de 3/8\"-aansluiting vrijmaken. Geen extra boorwerk nodig.", chip: "21 mm · 3/8\"" },
  { ph: "02", ti: "Plaatsing", p: "Systeem in de onderkast, kraan monteren en leidingen koppelen, in zo'n 30 minuten.", chip: "± 30 min" },
  { ph: "03", ti: "Kalibratie", p: "Met de Blue Companion-app de ORP-waarden bevestigen tussen −400 en −600 mV.", chip: "−400 / −600 mV" },
  { ph: "04", ti: "Service-ID", p: "Digitale ID aanmaken voor tracking van de verplichte 12-maandelijkse filterbeurt.", chip: "12 mnd cyclus" },
];

function Installer() {
  return (
    <section className="section bg-paper2" id="installatie">
      <div className="wrap">
        <div className="sec-head" style={{ maxWidth: 820 }}>
          <p className="eyebrow">08 · Installatie &amp; service</p>
          <h2 className="display">In 30 minuten<br />geïnstalleerd.</h2>
          <p className="lead">Onze erkende installateurs volgen een strak protocol, van voorbereiding tot kalibratie, zodat je dezelfde dag nog vitaal water tapt.</p>
        </div>
        <div className="install-grid">
          {INSTALL.map((s) => (
            <div className="install-card" key={s.ph}>
              <div className="ph">STAP {s.ph}</div>
              <div className="ti">{s.ti}</div>
              <p>{s.p}</p>
              <span className="chip">{s.chip}</span>
            </div>
          ))}
        </div>
        <div className="install-meta">
          <div className="m"><Ico.clock width="26" height="26" style={{ color: "var(--teal-700)" }} /><div><div className="big">± 30 min</div><div className="sm">Plaatsingstijd</div></div></div>
          <div className="m"><Ico.wrench width="26" height="26" style={{ color: "var(--teal-700)" }} /><div><div className="big">21 mm</div><div className="sm">Kraanopening</div></div></div>
          <div className="m"><Ico.recycle width="26" height="26" style={{ color: "var(--teal-700)" }} /><div><div className="big">12 mnd</div><div className="sm">Filteronderhoud</div></div></div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   FAQ
----------------------------------------------------------------- */
const FAQS = [
  ["Wat doet waterstofrijk water voor mijn lichaam?", "Moleculaire waterstof (H₂) is een van nature voorkomend, smaakloos gas dat volledig opgelost in het water zit. Wetenschappelijk onderzoek naar moleculaire waterstof als selectieve antioxidant loopt volop; wij doen geen medische claims. Wat vaststaat, zijn de gemeten waarden aan de uitloop: 1.200–1.600 ppb opgeloste H₂ en een ORP van −400/−600 mV. Dagelijks drinken is volkomen normaal. Je proeft zuiver, fris water."],
  ["Hoeveel water verbruikt het systeem?", "Zoals elk omgekeerde-osmosesysteem gebruikt VitaTap spoelwater om het membraan schoon te houden. Het systeem produceert alleen wanneer je tapt: voor dagelijks drink- en kookwater gaat het om enkele extra liters per dag, een fractie van wat één wasbeurt verbruikt."],
  ["Hoe vaak moet het filter vervangen worden?", "De meeste filters gaan een jaar mee, maar elk onderdeel heeft zijn eigen levensduur. Vuistregels: sedimentfilter 3–12 maanden (afhankelijk van waterkwaliteit), koolfilter en remineralisatiefilter elk jaar, UV-lamp elk jaar, RO-membraan elke 3 jaar. Al dit onderhoud zit in het abonnement inbegrepen. De Blue Companion-app houdt automatisch bij wanneer vervanging nodig is."],
  ["Past de kraan op mijn bestaande keuken?", "In de meeste keukens wel. De kraan gebruikt een standaard 21 mm doorvoer en 3/8\"-aansluiting, en het systeem verdwijnt compact in je onderkast. Een erkende installateur controleert dit vooraf."],
  ["Wat is het verschil met een gewone waterfilter?", "Een gewone filter haalt alleen smaak en chloor weg. VitaTap zuivert moleculair en houdt verontreinigingen zoals PFAS, microplastics en bacteriën tot 99,9% tegen, remineraliseert daarna bewust en voegt moleculaire waterstof toe. Zuiver én vitaal, niet zomaar gefilterd."],
  ["Koop of abonnement?", "VitaTap werkt met een abonnement waarin installatie-ondersteuning, onderhoud en filters zijn inbegrepen. Zo blijft je water altijd op niveau zonder verrassingen. Een eenmalige opstartkost van €500 dekt de installatie."],
  ["Wat als ik verhuis?", "Je abonnement verhuist gewoon mee. Een erkende installateur demonteert het systeem op je oude adres en plaatst het opnieuw op je nieuwe adres. Je betaalt enkel de verplaatsing, geen nieuwe opstartkost. Eén telefoontje volstaat om dit in te plannen."],
  ["Hoe zeg ik mijn abonnement op?", "Het maandplan is per maand opzegbaar; jaar- en 5-jaarplannen lopen tot het einde van de gekozen periode en worden nooit stilzwijgend voor een nieuwe volledige termijn verlengd. Bij stopzetting komt een erkende installateur het systeem netjes demonteren."],
  ["Welke garantie krijg ik?", "Zolang je abonnement loopt, valt de werking van kraan en systeem onder de service: defecte onderdelen worden hersteld of vervangen zonder extra kosten, en het jaarlijkse onderhoud met filtervervanging zit standaard inbegrepen."],
];

function FAQ() {
  const [open, setOpen] = uS4(0);
  return (
    <section className="section bg-paper" id="faq">
      <div className="wrap">
        <div className="sec-head"><p className="eyebrow">09 · FAQ</p><h2 className="display">Veelgestelde vragen</h2></div>
        <div className="faq-list">
          {FAQS.map(([q, a], i) => (
            <div className={"faq-item" + (open === i ? " open" : "")} key={i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                {q}<Ico.plus className="pm" />
              </button>
              <div className="faq-a">
                <div className="inner">{a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   CTA + FOOTER
----------------------------------------------------------------- */
function CTA() {
  return (
    <section className="section cta-band photo">
      <div className="cta-bg"><img src="assets/kitchen-dark.webp" alt="" width="820" height="1230" loading="lazy" decoding="async" /></div>
      <div className="wrap">
        <p className="eyebrow on-dark" style={{ justifyContent: "center", display: "flex" }}>Klaar voor de overstap?</p>
        <h2 className="display">Zuiver water. Elke dag.</h2>
        <p className="lead">Vraag vandaag je gratis en vrijblijvend adviesgesprek aan. Een erkende installateur bekijkt je situatie en plaatst alles nadien in zo'n 30 minuten.</p>
        <div className="hero-actions">
          <a className="btn btn-primary solid-white" href="#contact">Vraag gratis advies <Ico.arrow className="arr" width="18" height="18" /></a>
          <a className="btn btn-ghost" href="#prijzen">Bekijk prijzen</a>
        </div>
      </div>
    </section>
  );
}

const FOOT = [
  ["Product", [["De aanpak", "#aanpak"], ["Werking", "#werking"], ["De kraan", "#kraan"], ["Wetenschap", "#wetenschap"]]],
  ["Service", [["Prijzen", "#prijzen"], ["Installateurs", "#installateurs"], ["Installatie", "#installatie"], ["FAQ", "#faq"]]],
  ["Juridisch", [["Erkend partner worden", "#installateurs"], ["Privacybeleid", "privacy.html"], ["Algemene voorwaarden", "voorwaarden.html"], ["Cookiebeleid", "cookiebeleid.html"]]],
];

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Logo className="logo" />
            <div className="wordmark">VitaTap</div>
            <p>Gezuiverd, geremineraliseerd en waterstofrijk water, rechtstreeks uit je kraan. De wellness-utility voor elke keuken.</p>
            <div className="foot-endorse">
              <span className="bc-chip"><img src="assets/bluecare-shield.webp" alt="Blue Care Products" width="220" height="234" loading="lazy" decoding="async" /></span>
              <div className="et"><b>Een merk van Blue Care Products</b>Veilig &amp; professioneel waterbeheer</div>
            </div>
            <address className="foot-legal">
              Blue Care Products BV · Minister Liebaertlaan 1, 8500 Kortrijk<br />
              BTW BE 0653.897.883
            </address>
          </div>
          {FOOT.map(([h, links]) => (
            <div className="foot-col" key={h}>
              <h5>{h}</h5>
              {links.map(([l, href]) => <a key={l} href={href}>{l}</a>)}
            </div>
          ))}
        </div>
        <div className="foot-bottom">
          <span>© 2026 VitaTap · Prijzen excl. btw tenzij anders vermeld</span>
          <span><a href="mailto:info@vitatap.be">info@vitatap.be</a> · <a href="tel:+32476371722">+32 476 37 17 22</a></span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Prijzen, Locator, Installer, FAQ, CTA, Footer });
