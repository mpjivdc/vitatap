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
  "Blue Compagnion-app & support",
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
  "Moleculaire H₂ - antioxidant",
  "UV-gesteriliseerd",
  "Geen plastic flessen",
  "Onbeperkt beschikbaar",
];
const BOTTLE_ML = 0.5; // 50cl referentiefles voor plastic teller

function LiterSim() {
  const [people, setPeople] = uS4(2);
  const [litersPerPerson, setLitersPerPerson] = uS4(4);
  const litersPerDay = people * litersPerPerson;
  const litersPerMonth = litersPerDay * 30;
  const maxCost = Math.max(VT_MONTH_INCL, ...WATER_BRANDS.map(b => b.priceL * litersPerMonth));
  const bottlesPerYear = Math.round(litersPerDay * 365 / BOTTLE_ML);
  const bestBottled = Math.min(...WATER_BRANDS.map(b => b.priceL * litersPerMonth));
  const savings = bestBottled > VT_MONTH_INCL ? null : VT_MONTH_INCL - bestBottled;
  const vtWins = WATER_BRANDS.filter(b => b.priceL * litersPerMonth > VT_MONTH_INCL).length;

  return (
    <div className="liter-compare">
      <div className="lc-head">Bereken jouw besparing</div>

      <div className="lc-controls">
        <div className="lc-sim-row">
          <span className="lc-sim-label">Personen in huis</span>
          <div className="lc-pills">
            {[1, 2, 3, 4].map(n => (
              <button key={n} className={"lc-pill" + (people === n ? " active" : "")} onClick={() => setPeople(n)}>
                {n}{n === 4 ? "+" : ""}
              </button>
            ))}
          </div>
        </div>
        <div className="lc-sim-row">
          <span className="lc-sim-label">Liter / persoon / dag</span>
          <div className="lc-pills">
            {[2, 3, 4, 5].map(n => (
              <button key={n} className={"lc-pill" + (litersPerPerson === n ? " active" : "")} onClick={() => setLitersPerPerson(n)}>
                {n}L
              </button>
            ))}
          </div>
          <span className="lc-usage">{litersPerDay}L/dag totaal</span>
        </div>
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
        {vtWins > 0 ? (
          <div className="lc-insight lc-insight-win">
            <span className="lc-insight-val">€{fmt((WATER_BRANDS.filter(b => b.priceL * litersPerMonth > VT_MONTH_INCL).reduce((s,b) => s + b.priceL * litersPerMonth, 0) / vtWins) - VT_MONTH_INCL)}</span>
            <span className="lc-insight-lab">goedkoper per maand dan merkenwater</span>
          </div>
        ) : (
          <div className="lc-insight lc-insight-neutral">
            <span className="lc-insight-val">{litersPerPerson < 4 ? "↑ verbruik" : "4+ pers."}</span>
            <span className="lc-insight-lab">voor prijsvoordeel — verhoog slider</span>
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
          <p className="eyebrow">06 - Prijzen</p>
          <h2 className="display">Alles inbegrepen.<br />Altijd zuiver, altijd vitaal.</h2>
          <p className="lead">Onderhoud, filtervervanging en support zitten er standaard in. Kies de looptijd die bij je past - hoe langer, hoe voordeliger.</p>
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
              <div className="price-setup">+ <b>€500</b> opstartkost eenmalig · €605 incl. btw</div>
              <a className={"btn " + (p.featured ? "btn-primary solid-white" : "btn-primary")} href="#contact"
                onClick={() => window.dispatchEvent(new CustomEvent("vt-plan", { detail: p.key }))}>
                Kies {p.name.toLowerCase()} <Ico.arrow className="arr" width="18" height="18" />
              </a>
            </div>
          ))}
        </div>
        <div className="startup-banner">
          <span><Ico.wrench className="ic" width="20" height="20" /> <span>Installatie door <b>erkende vakman</b> - opstartkost €500 eenmalig</span></span>
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
   PARTNER LOCATOR
----------------------------------------------------------------- */
const INSTALLERS = [
  { nm: "AquaVrij Installaties", city: "Gent", km: "3,2", av: "A" },
  { nm: "WaterWerk Vlaanderen", city: "Merelbeke", km: "6,8", av: "W" },
  { nm: "PuurTap Service", city: "Deinze", km: "11,4", av: "P" },
];
const PINS = [
  { l: 28, t: 34 }, { l: 62, t: 22 }, { l: 74, t: 58 }, { l: 40, t: 66 },
];

function Locator() {
  const [zip, setZip] = uS4("");
  const [shown, setShown] = uS4(false);
  const submit = (e) => { e.preventDefault(); if (zip.trim().length >= 4) setShown(true); };
  return (
    <section className="section locator" id="installateurs">
      <div className="wrap">
        <div className="loc-grid">
          <div>
            <p className="eyebrow on-dark">07 - Partner gateway</p>
            <h2 className="display" style={{ color: "#fff", fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Vind je erkende installateur</h2>
            <p className="lead" style={{ color: "rgba(255,255,255,.88)", marginTop: 18 }}>Geef je postcode in en we tonen de dichtstbijzijnde erkende VitaTap-installateurs - getraind in het 30-minuten plaatsingsprotocol en de Blue Compagnion-kalibratie.</p>
            <form className="loc-form" onSubmit={submit}>
              <input value={zip} onChange={(e) => setZip(e.target.value)} inputMode="numeric" placeholder="Bv. 9000" aria-label="Postcode" maxLength="6" />
              <button className="btn btn-primary solid-white" type="submit">Zoek <Ico.arrow className="arr" width="18" height="18" /></button>
            </form>
            <p className="loc-note">Meer dan 120 erkende installateurs in België &amp; Nederland.</p>
            <div className="loc-results">
              {shown && INSTALLERS.map((it, i) => (
                <div className="installer" key={i} style={{ animationDelay: i * 0.08 + "s" }}>
                  <span className="av">{it.av}</span>
                  <div>
                    <div className="nm">{it.nm}</div>
                    <div className="ds">{it.city} · {it.km} km</div>
                  </div>
                  <span className="badge">Erkend</span>
                </div>
              ))}
            </div>
          </div>
          <div className="loc-map">
            {PINS.map((p, i) => (
              <span className="loc-pin" key={i} style={{ left: p.l + "%", top: p.t + "%" }}><span className="p" /></span>
            ))}
            <span className="loc-pin me" style={{ left: "50%", top: "46%" }}><span className="p" /></span>
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
  { ph: "01", ti: "Voorbereiding", p: "De bestaande kraanopening (21 mm) en de 3/8\"-aansluiting vrijmaken - geen extra boorwerk nodig.", chip: "21 mm · 3/8\"" },
  { ph: "02", ti: "Plaatsing", p: "Systeem in de onderkast, kraan monteren en leidingen koppelen - in zo'n 30 minuten.", chip: "± 30 min" },
  { ph: "03", ti: "Kalibratie", p: "Met de Blue Compagnion-app de ORP-waarden bevestigen tussen −400 en −600 mV.", chip: "−400 / −600 mV" },
  { ph: "04", ti: "Service-ID", p: "Digitale ID aanmaken voor tracking van de verplichte 12-maandelijkse filterbeurt.", chip: "12-mnd cyclus" },
];

function Installer() {
  return (
    <section className="section bg-paper2" id="installatie">
      <div className="wrap">
        <div className="sec-head" style={{ maxWidth: 820 }}>
          <p className="eyebrow">08 - Installatie &amp; service</p>
          <h2 className="display">In 30 minuten<br />geïnstalleerd.</h2>
          <p className="lead">Onze erkende installateurs volgen een strak protocol - van voorbereiding tot kalibratie - zodat je dezelfde dag nog vitaal water tapt.</p>
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
  ["Wat doet waterstofrijk water voor mijn lichaam?", "Moleculaire waterstof (H₂) is een van nature voorkomend, smaakloos gas dat volledig opgelost in het water zit. Als selectieve antioxidant neutraliseert het schadelijke vrije radicalen zonder de nuttige moleculen in je lichaam te beïnvloeden. Dagelijks drinken is volkomen normaal - je proeft alleen zuiver, fris water."],
  ["Hoeveel water verbruikt het systeem?", "Onze moleculaire RO is geoptimaliseerd op een gunstige verhouding tussen gezuiverd en afvoerwater. Voor dagelijks drink- en kookwater blijft het verbruik beperkt, en het systeem produceert alleen wanneer je tapt."],
  ["Hoe vaak moet het filter vervangen worden?", "De meeste filters gaan een jaar mee, maar elk onderdeel heeft zijn eigen levensduur. Vuistregels: sedimentfilter 3–12 maanden (afhankelijk van waterkwaliteit), koolfilter en remineralisatiefilter elk jaar, UV-lamp elk jaar, RO-membraan elke 3 jaar. Al dit onderhoud zit in het abonnement inbegrepen - de Blue Compagnion-app houdt automatisch bij wanneer vervanging nodig is."],
  ["Past de kraan op mijn bestaande keuken?", "In de meeste keukens wel. De kraan gebruikt een standaard 21 mm doorvoer en 3/8\"-aansluiting, en het systeem verdwijnt compact in je onderkast. Een erkende installateur controleert dit vooraf."],
  ["Wat is het verschil met een gewone waterfilter?", "Een gewone filter haalt alleen smaak en chloor weg. VitaTap zuivert moleculair tot 99,9%, remineraliseert daarna bewust en voegt moleculaire waterstof toe - zuiver én vitaal, niet zomaar gefilterd."],
  ["Koop of abonnement?", "VitaTap werkt met een abonnement waarin installatie-ondersteuning, onderhoud en filters zijn inbegrepen. Zo blijft je water altijd op niveau zonder verrassingen. Een eenmalige opstartkost van €500 dekt de installatie."],
  ["Wat als ik verhuis?", "Je abonnement verhuist gewoon mee. Een erkende installateur demonteert het systeem op je oude adres en plaatst het opnieuw op je nieuwe adres - je betaalt enkel de verplaatsing, geen nieuwe opstartkost. Eén telefoontje volstaat om dit in te plannen."],
  ["Hoe zeg ik mijn abonnement op?", "Het maandplan is per maand opzegbaar; jaar- en 5-jaarplannen lopen tot het einde van de gekozen periode en worden nooit stilzwijgend voor een nieuwe volledige termijn verlengd. Bij stopzetting komt een erkende installateur het systeem netjes demonteren."],
  ["Welke garantie krijg ik?", "Zolang je abonnement loopt, valt de werking van kraan en systeem onder de service: defecte onderdelen worden hersteld of vervangen zonder extra kosten, en het jaarlijkse onderhoud met filtervervanging zit standaard inbegrepen."],
];

function FAQ() {
  const [open, setOpen] = uS4(0);
  return (
    <section className="section bg-paper" id="faq">
      <div className="wrap">
        <div className="sec-head"><p className="eyebrow">09 - FAQ</p><h2 className="display">Veelgestelde vragen</h2></div>
        <div className="faq-list">
          {FAQS.map(([q, a], i) => (
            <div className={"faq-item" + (open === i ? " open" : "")} key={i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                {q}<Ico.plus className="pm" />
              </button>
              <div className="faq-a" style={{ maxHeight: open === i ? "320px" : "0" }}>
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
      <div className="cta-bg"><img src="assets/kitchen-dark.png" alt="" /></div>
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
  ["Bedrijf", [["Over VitaTap", "#"], ["Erkend partner worden", "#installateurs"], ["Duurzaamheid", "#"], ["Pers", "#"]]],
];

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Logo className="logo" />
            <div className="wordmark">VitaTap</div>
            <p>Gezuiverd, geremineraliseerd en waterstofrijk water - rechtstreeks uit je kraan. De wellness-utility voor elke keuken.</p>
            <div className="foot-endorse">
              <span className="bc-chip"><img src="assets/bluecare-shield.png" alt="Blue Care Products" /></span>
              <div className="et"><b>Een merk van Blue Care Products</b>Veilig &amp; professioneel waterbeheer</div>
            </div>
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
          <span>hallo@vitatap.be · +32 9 000 00 00</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Prijzen, Locator, Installer, FAQ, CTA, Footer });
