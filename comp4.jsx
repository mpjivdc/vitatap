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

// Stripe Payment Links (Maarten, 2026-09-01/02, option 3): the customer pays ONLINE FIRST,
// the install visit follows. Jaar/5-jaar = opstartkost €500 + plan in one checkout (one-off).
// Maandelijks = opstartkost €500 ONLY online; the €65/mnd subscription is created in Stripe on
// install day (start date = install date, SEPA DD or card), so the first billing date is variable.
// Stripe Tax adds 21% btw at checkout; prices excl. btw. LIVE-mode links since 2026-09-02
// (account acct_1U9PQNP6faFiSAdx); the sandbox twins are in the hub runbook. No secret involved.
const STRIPE_LINKS = {
  m:   "https://buy.stripe.com/bJeeVfe7c9Ye71H2lh2B202", // opstartkost €500 only (subscription set up at install)
  y:   "https://buy.stripe.com/14AcN74wC9YegCh4tp2B200", // opstartkost €500 + jaarlijks €540
  "5": "https://buy.stripe.com/dRm14p8MS1rI3PvaRN2B203", // opstartkost €500 + 5-jaarlijks €2.340
};
// ?locale=nl: Dutch checkout regardless of browser language.
// client_reference_id: the chosen plan travels with the payment into the Stripe dashboard.
const stripeUrl = (k) => STRIPE_LINKS[k] + "?locale=nl&client_reference_id=plan-" + k;
// Shown under the buttons (tooltips don't exist on phones): what is paid now, what follows.
const STRIPE_NOTE = {
  m: "Online: nu enkel de opstartkost; het maandabonnement start op de installatiedag.",
  y: "Online: opstartkost + jaarabonnement in één betaling; daarna plannen we de installatie.",
  "5": "Online: opstartkost + 5-jaarabonnement in één betaling; daarna plannen we de installatie.",
};

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
  "Moleculaire H₂, 1200–1600 ppb",
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
              <div className="price-actions">
                <a className={"btn " + (p.featured ? "btn-primary solid-white" : "btn-primary")} href="#contact"
                  onClick={() => window.dispatchEvent(new CustomEvent("vt-plan", { detail: p.key }))}>
                  Kies {p.name.toLowerCase()} <Ico.arrow className="arr" width="18" height="18" />
                </a>
                <a className="btn btn-ghost" href={stripeUrl(p.key)} target="_blank" rel="noopener noreferrer">
                  Online afsluiten
                </a>
                <p className="price-online-note">{STRIPE_NOTE[p.key]}</p>
              </div>
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
const MAP = {"W":520,"H":560,"paths":{"NL":"M360.123,156.671L357.316,156.595L354.709,156.519L353.305,156.289L351.801,155.601L351.099,154.224L350.297,152.617L350.497,151.545L353.004,148.708L353.405,147.864L353.104,147.48L353.405,146.174L355.31,141.868L355.511,140.097L354.709,138.864L353.405,138.17L349.394,136.858L347.489,135.083L346.687,133.46L345.784,132.996L344.481,133.538L341.172,134.156L338.464,133.306L335.256,130.289L334.554,127.577L334.153,125.561L333.35,124.785L332.247,125.871L330.944,127.577L328.236,127.733L327.534,127.345L327.334,126.414L327.234,125.561L326.431,124.474L325.73,123.853L322.32,126.957L321.017,126.88L319.412,125.716L318.61,124.552L316.905,125.251L315.301,126.647L315.903,129.36L315,129.824L313.095,129.592L310.889,128.507L308.482,127.81L304.772,125.949L299.658,127.5L296.048,125.639L293.141,125.483L291.235,124.009L289.33,121.6L290.734,119.967L292.038,119.422L297.452,119.111L301.463,120.122L308.583,125.406L310.388,125.328L312.293,124.707L311.29,123.232L309.485,122.533L306.878,121.133L304.772,119.111L309.686,118.488L308.984,117.475L308.382,115.683L303.168,109.514L304.07,107.792L305.374,104.189L306.978,101.207L308.282,100.421L310.488,98.299L315.1,91.998L318.109,86.864L320.315,80.844L323.523,63.956L324.526,61.074L326.03,57.867L328.036,58.509L329.339,59.391L334.153,56.985L342.475,50.713L344.882,45.23L347.288,42.725L356.814,37.706L362.029,36.247L370.151,35.841L376.067,34.948L383.086,34.624L385.794,37.706L387.298,39.974L389.805,41.188L393.715,42.078L393.414,46.522L393.515,55.218L393.214,56.744L391.409,60.433L389.604,66.914L389.103,71.223L388.601,72.099L381.181,72.019L380.178,72.816L379.978,73.692L380.379,74.806L380.178,75.92L379.577,76.794L379.877,78.224L381.181,79.812L383.487,80.844L385.994,80.923L387.298,80.765L388.2,81.875L389.203,83.618L389.103,85.914L388.702,88.84L387.599,91.603L384.189,94.757L382.585,95.86L381.181,96.489L380.479,97.276L380.178,98.378L380.279,99.321L382.685,101.835L382.585,102.384L381.883,103.718L380.98,104.972L374.763,107.557L372.156,107.323L370.752,108.575L370.251,108.888L368.647,107.636L364.937,106.305L363.633,106.775L362.831,107.557L360.525,108.418L358.92,109.826L358.92,111.624L361.828,116.306L362.831,117.242L362.831,119.033L364.235,121.211L365.739,123.931L365.839,125.639L365.739,127.422L364.937,129.902L362.43,135.701L362.43,136.858L362.63,137.707L363.533,137.938L364.134,138.401L363.934,139.172L359.221,143.176L358.619,143.869L356.714,143.638L356.413,144.33L356.614,145.406L357.416,146.405L359.121,146.866L360.525,147.864L361.728,149.858ZM310.889,128.507L310.488,130.211L309.485,132.069L305.775,134.697L301.864,136.473L299.959,136.241L298.555,135.315L297.853,134.388L295.748,133.46L292.94,132.996L291.135,134.001L289.932,134.928L288.829,134.774L288.027,134.001L287.325,132.765L286.522,128.895L288.628,128.198L293.241,127.888L296.75,129.282L301.363,129.902L304.973,128.043L307.781,129.669ZM369.649,31.374L365.739,33L364.736,32.674L365.037,32.187L368.446,31.211ZM358.419,33.812L352.904,34.543L350.999,33.974L350.698,33.487L352.202,33.162L356.915,33.081L358.319,33.568ZM335.556,40.865L330.342,44.261L329.941,43.776L333.25,40.784ZM341.573,37.22L338.966,37.625L337.762,36.977L344.08,35.111L347.99,34.543L348.692,34.786ZM329.339,51.921L326.532,55.218L324.827,54.253L324.426,53.53L325.228,50.955L329.339,46.683ZM303.168,112.718L305.976,115.137L306.477,115.917L306.677,116.774L303.268,117.709L299.558,114.747L297.151,115.449L296.249,114.045L296.249,113.108L298.756,112.405ZM380.78,28.037L378.273,28.2L378.975,26.978L381.382,26L382.685,26Z","LU":"M363.633,184.229L363.332,185.36L363.433,187.997L364.235,190.555L366.04,193.109L367.443,194.986L369.349,196.486L372.658,197.91L373.961,198.21L374.062,200.081L373.861,202.101L372.758,203.223L371.655,204.791L370.853,206.732L370.051,210.459L369.95,213.064L368.045,212.022L367.042,211.278L365.338,211.055L363.633,211.65L362.43,212.99L360.625,213.361L359.221,212.99L358.319,212.022L357.617,211.427L355.411,210.831L354.508,209.416L355.21,208.745L355.812,207.627L356.313,206.21L357.015,204.791L354.909,201.054L354.408,199.857L352.703,197.76L352.703,196.711L353.104,195.661L353.004,194.836L353.205,192.959L354.408,191.156L355.21,188.9L356.614,185.888L359.722,182.192L361.828,182.796L362.831,182.796L363.433,184.079Z","FR":"M457.289,480.692L456.587,486.222L457.088,487.865L458.091,489.047L458.592,490.295L459.395,505.018L459.194,506.192L455.785,512.117L455.083,513.808L454.882,521.141L454.281,523.084L453.077,525.025L450.972,531.227L449.066,534L443.952,530.582L440.944,529.162L439.54,527.547L438.538,526.448L439.139,524.96L440.543,523.472L440.744,522.242L437.535,520.881L436.031,519.974L436.031,518.418L437.134,515.952L436.632,513.873L434.827,514.003L433.323,513.678L433.223,512.573L434.226,511.207L435.63,509.449L435.529,507.495L433.925,506.648L432.421,505.018L431.819,502.864L433.023,501.362L434.827,500.382L433.524,498.158L432.521,498.093L431.819,497.635L432.421,496.588L433.825,495.016L435.931,490.361L438.738,488.194L443.752,486.748L445.156,486.156L446.359,484.512L447.763,483.459L449.367,483.59L450.972,484.183L451.874,484.906L452.676,484.183L453.278,482.142L452.877,480.363L453.077,475.414L453.98,472.638L455.484,472.439L456.787,474.026L456.687,475.348L457.189,478.582ZM405.347,291.266L401.938,293.13L401.236,294.777L399.932,296.923L397.726,297.853L395.62,298.139L393.815,297.853L392.813,296.995L392.913,296.208L392.011,295.564L389.704,295.564L387.298,297.066L385.392,299.496L385.994,300.853L387.799,301.21L388.2,301.709L388.2,302.423L387.599,303.279L386.897,304.704L383.186,308.975L379.476,313.238L378.875,314.515L377.772,315.437L373.059,317.705L372.557,318.626L372.257,322.446L371.755,325.624L368.246,328.516L364.836,331.474L363.934,333.233L363.332,335.272L362.229,337.66L362.029,338.853L363.733,340.886L363.533,342.498L363.031,344.878L361.327,346.556L359.522,347.465L359.522,350.049L360.525,350.398L362.731,350.188L365.939,348.373L367.945,345.927L366.742,343.688L366.541,343.268L366.842,342.708L369.349,340.255L372.257,338.782L376.468,338.502L381.482,339.344L381.983,339.694L381.682,341.237L382.184,343.478L383.086,345.017L381.883,349.49L382.785,350.816L384.189,352.49L385.292,354.024L386.897,355.417L388.3,357.713L388.802,359.034L386.495,361.397L382.785,363.548L382.284,364.866L382.384,366.46L382.785,367.707L384.891,369.299L387.097,372.825L388.601,376.001L391.71,379.103L392.512,379.999L392.311,380.756L391.409,382.064L390.406,386.394L389.103,387.081L387.699,387.355L383.788,390.511L382.083,390.099L379.577,390.168L377.872,391.196L377.972,393.114L379.577,394.962L380.479,396.876L380.88,398.926L382.685,400.428L385.092,401.315L386.495,401.383L387.398,401.929L388,402.611L389.002,406.97L388.401,408.058L387.097,408.534L386.295,410.302L384.691,412.95L383.788,415.053L384.791,416.883L385.192,418.238L384.691,419.659L385.392,421.823L387.298,423.986L392.311,427.09L397.024,429.517L398.528,429.922L404.846,428.372L405.949,428.506L406.751,430.393L407.052,431.672L406.35,433.556L404.645,436.245L402.74,438.327L401.637,440.138L401.837,441.747L401.938,443.891L400.434,444.56L400.333,444.092L399.732,443.757L399.23,443.958L398.829,444.427L398.729,445.23L395.52,446.635L393.214,448.039L384.39,456.511L380.279,459.041L379.476,460.504L378.674,463.294L376.268,465.683L374.062,466.811L368.847,468.004L363.533,470.52L361.226,469.461L355.009,469.527L351.199,466.479L343.779,464.555L341.372,460.105L338.063,459.839L335.857,459.972L334.554,459.307L334.153,457.776L334.153,456.312L331.846,456.978L330.041,456.978L328.938,457.577L328.136,458.242L327.133,457.776L326.532,457.976L326.632,458.841L324.426,459.041L322.12,458.508L316.003,456.178L315.1,455.845L310.889,454.979L309.184,454.046L307.781,451.712L306.677,451.044L306.076,450.577L302.165,451.712L300.761,453.513L298.656,455.646L284.016,465.949L281.308,470.189L278.2,476.536L277.999,479.44L279.303,488.785L282.311,493.706L282.712,494.885L281.007,494.885L278.2,494.23L275.893,493.509L273.788,493.902L271.682,494.951L269.777,495.54L268.473,495.737L267.571,496.26L267.17,497.439L267.069,498.289L264.763,498.093L259.348,496.391L254.535,495.213L251.627,496.522L249.822,497.766L248.519,497.57L247.616,496.326L246.914,495.016L245.009,493.902L240.697,492.132L240.998,491.279L241.7,490.098L241.7,489.376L240.798,488.325L236.887,487.142L235.082,486.879L233.879,487.668L232.976,488.653L230.77,485.038L229.266,484.314L226.859,484.183L224.152,483.064L221.344,481.68L214.526,479.44L212.621,479.176L211.919,479.505L211.417,480.89L211.116,484.643L210.816,485.104L207.607,485.235L203.696,484.709L201.891,484.972L200.287,484.972L198.783,483.919L192.064,485.104L190.961,484.512L189.357,482.8L187.452,481.417L186.048,480.758L184.845,479.901L183.742,479.769L182.137,480.56L179.831,480.89L177.926,480.824L176.923,480.956L172.611,476.734L172.01,475.612L169.804,475.281L167.197,475.215L160.478,472.505L157.37,470.984L156.969,470.123L156.969,469.461L156.467,469.593L155.565,470.851L155.063,471.844L154.361,472.042L153.459,471.91L152.557,471.315L151.955,470.587L152.557,469.262L153.559,467.606L154.061,465.75L153.96,464.157L152.256,463.095L149.749,462.63L147.944,462.497L145.537,461.567L144.334,460.902L143.331,459.041L143.231,457.71L147.743,456.578L151.855,451.712L155.765,434.094L158.573,413.086L160.578,409.146L163.186,407.99L161.08,405.132L159.776,406.561L159.275,408.126L158.573,408.942L160.077,389.482L161.18,382.27L163.085,374.759L166.996,377.725L170.205,380.756L171.909,383.439L174.015,392.155L175.519,394.004L177.926,395.782L177.023,393.798L175.319,392.292L172.812,380.619L171.207,377.311L168.701,374.552L160.679,368.676L159.877,367.499L159.475,365.282L162.183,365.351L164.489,366.46L164.188,365.213L163.486,363.895L162.484,359.104L161.581,347.884L161.681,345.927L161.28,343.548L158.673,343.058L156.668,342.918L154.462,342.007L143.432,335.342L139.721,328.445L135.811,323.365L134.908,321.103L135.009,318.838L137.014,314.09L135.209,311.037L133.505,310.468L132,308.975L133.404,306.485L134.507,304.847L136.713,304.419L139.721,304.989L142.529,306.414L144.635,306.77L138.217,302.922L127.689,304.205L125.382,303.706L123.477,302.851L122.775,299.996L124.279,298.71L125.583,296.279L124.079,294.634L122.073,293.989L118.965,294.061L116.057,294.562L115.355,293.559L117.06,290.908L115.555,289.904L113.55,290.406L110.642,290.908L107.834,290.119L105.227,287.104L103.523,287.104L102.319,287.463L100.514,286.313L98.609,286.026L97.306,286.385L95.501,284.66L84.571,281.133L79.858,280.701L75.546,282.285L73.14,281.781L71.335,279.475L69.931,275.723L62.912,272.76L64.316,270.807L67.524,270.372L71.234,268.996L72.638,267.329L69.73,265.298L67.524,264.79L66.622,264.064L65.719,262.321L67.023,261.449L67.925,261.885L70.533,262.175L75.045,261.739L73.44,259.921L71.636,259.485L70.833,259.048L67.223,258.83L65.519,259.485L61.809,259.194L60.906,257.228L60.605,255.552L61.708,251.83L67.023,248.468L80.159,244.735L85.774,245.247L89.785,244.588L94.498,242.315L96.503,240.26L103.222,239.085L109.539,241.214L115.455,249.2L118.263,251.903L125.082,247.224L135.309,247.371L137.415,250.004L138.217,247.81L140.123,245.174L141.627,246.346L142.429,247.956L153.158,247.517L154.863,247.078L151.955,245.174L149.649,240.627L149.147,223.748L146.139,219.006L142.73,211.427L141.125,206.956L141.025,205.389L141.526,203.148L145.738,203.223L148.947,203.82L155.164,202.101L158.172,203.297L157.971,206.807L158.874,211.278L159.977,213.361L161.481,215.814L166.495,215.591L171.909,217.002L178.728,217.225L188.655,219.748L192.867,218.264L196.978,215.22L204.799,213.213L205.501,212.171L200.989,212.618L196.777,210.682L196.276,208.522L196.777,206.657L198.382,202.326L210.415,195.436L218.938,193.335L227.862,189.577L232.375,185.662L235.383,180.531L236.386,179.473L237.589,178.49L236.386,176.674L237.188,157.206L238.09,153.689L239.795,150.778L242.502,148.554L246.513,146.098L261.354,142.715L263.56,141.406L263.861,143.484L264.964,146.174L265.665,147.633L265.064,149.552L265.565,151.161L267.571,153.995L270.078,156.671L272.284,158.428L272.985,158.199L274.59,157.741L277.398,155.983L279.804,155.448L281.108,156.748L281.81,157.512L283.314,160.565L283.715,163.691L284.417,166.279L285.62,167.343L290.032,167.723L293.341,168.711L294.244,169.547L295.347,175.311L295.948,176.144L296.851,175.463L297.653,174.554L298.756,174.402L300.661,174.781L303.268,174.857L305.875,175.463L309.485,178.792L309.385,179.851L308.683,181.739L308.382,183.249L308.984,183.852L309.987,185.36L309.786,187.168L308.783,188.448L308.482,189.502L308.482,190.179L308.783,190.705L309.585,191.156L314.9,191.832L319.813,191.156L322.922,189.351L323.423,187.47L324.326,185.285L326.131,183.4L327.434,182.796L328.637,183.551L326.632,191.231L328.036,193.184L328.236,196.111L328.838,198.659L330.543,198.584L332.648,199.033L334.153,200.007L335.957,201.503L338.464,202.924L340.269,203.372L340.871,204.567L342.375,205.911L344.581,208.671L346.586,210.533L347.589,210.533L349.494,209.789L352.302,209.342L354.508,209.416L355.411,210.831L357.617,211.427L358.319,212.022L359.221,212.99L360.625,213.361L362.43,212.99L363.633,211.65L365.338,211.055L367.042,211.278L368.045,212.022L369.95,213.064L370.953,212.841L373.059,213.51L375.265,215.517L376.067,217.596L376.368,218.709L377.27,219.97L380.78,225.523L381.983,225.819L383.186,224.931L383.989,223.748L385.192,223.526L386.997,224.044L388.2,224.71L388.802,227.149L389.203,227.592L390.005,227.075L391.509,226.928L393.715,227.519L396.924,226.854L399.431,225.819L400.734,225.893L402.84,228.7L405.247,229.734L410.461,230.545L416.076,231.873L418.282,232.978L419.786,233.494L419.987,237.174L419.486,237.762L413.87,245.101L411.564,247.737L410.361,251.538L409.458,257.228L407.854,262.684L405.347,267.837L404.445,271.747L405.146,274.278L404.745,278.321L403.241,283.797L402.94,287.966L403.943,290.693ZM160.378,359.938L159.375,363.41L157.57,360.216L155.063,357.365L154.562,354.79L154.562,354.093L157.47,355.974Z","BE":"M310.889,128.507L313.095,129.592L315,129.824L315.903,129.36L315.301,126.647L316.905,125.251L318.61,124.552L319.412,125.716L321.017,126.88L322.32,126.957L325.73,123.853L326.431,124.474L327.234,125.561L327.334,126.414L327.534,127.345L328.236,127.733L330.944,127.577L332.247,125.871L333.35,124.785L334.153,125.561L334.554,127.577L335.256,130.289L338.464,133.306L341.172,134.156L344.481,133.538L345.784,132.996L346.687,133.46L347.489,135.083L349.394,136.858L353.405,138.17L354.709,138.864L355.511,140.097L355.31,141.868L353.405,146.174L353.104,147.48L353.405,147.864L353.004,148.708L350.497,151.545L350.297,152.617L351.099,154.224L351.801,155.601L353.305,156.289L354.709,156.519L357.316,156.595L360.123,156.671L360.525,157.512L363.633,159.802L364.636,161.633L366.942,163.462L365.037,165.67L365.338,166.735L366.04,167.723L368.546,168.332L369.85,169.775L369.95,172.052L370.452,175.69L365.237,179.397L363.733,183.4L363.633,184.229L363.433,184.079L362.831,182.796L361.828,182.796L359.722,182.192L356.614,185.888L355.21,188.9L354.408,191.156L353.205,192.959L353.004,194.836L353.104,195.661L352.703,196.711L352.703,197.76L354.408,199.857L354.909,201.054L357.015,204.791L356.313,206.21L355.812,207.627L355.21,208.745L354.508,209.416L352.302,209.342L349.494,209.789L347.589,210.533L346.586,210.533L344.581,208.671L342.375,205.911L340.871,204.567L340.269,203.372L338.464,202.924L335.957,201.503L334.153,200.007L332.648,199.033L330.543,198.584L328.838,198.659L328.236,196.111L328.036,193.184L326.632,191.231L328.637,183.551L327.434,182.796L326.131,183.4L324.326,185.285L323.423,187.47L322.922,189.351L319.813,191.156L314.9,191.832L309.585,191.156L308.783,190.705L308.482,190.179L308.482,189.502L308.783,188.448L309.786,187.168L309.987,185.36L308.984,183.852L308.382,183.249L308.683,181.739L309.385,179.851L309.485,178.792L305.875,175.463L303.268,174.857L300.661,174.781L298.756,174.402L297.653,174.554L296.851,175.463L295.948,176.144L295.347,175.311L294.244,169.547L293.341,168.711L290.032,167.723L285.62,167.343L284.417,166.279L283.715,163.691L283.314,160.565L281.81,157.512L281.108,156.748L279.804,155.448L277.398,155.983L274.59,157.741L272.985,158.199L272.284,158.428L270.078,156.671L267.571,153.995L265.565,151.161L265.064,149.552L265.665,147.633L264.964,146.174L263.861,143.484L263.56,141.406L275.693,133.924L283.013,130.057L286.522,128.895L287.325,132.765L288.027,134.001L288.829,134.774L289.932,134.928L291.135,134.001L292.94,132.996L295.748,133.46L297.853,134.388L298.555,135.315L299.959,136.241L301.864,136.473L305.775,134.697L309.485,132.069L310.488,130.211Z"},"pins":{"Kortrijk":[284.3,153.2],"Brussel":[314.4,152.3],"Antwerpen":[315.8,135.9],"Gent":[296.8,143.5],"Brugge":[282.9,136.4],"Hasselt":[342,148.8],"Luik":[348.4,162],"Namen":[328.9,169],"Charleroi":[316.9,171.6],"Leuven":[324.1,151]}};
const REGION_ORDER = ["FR", "NL", "LU", "BE"]; // draw order: home country (BE) painted last, on top

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
            <p className="lead" style={{ color: "rgba(255,255,255,.88)", marginTop: 18 }}>Geef je postcode in en we bekijken de mogelijkheden in jouw regio en nemen contact op. Een erkende vakman, uit ons eigen team of een gecertificeerde partner, plaatst alles volgens het 30-minuten protocol en kalibreert via de Blue Companion-app.</p>
            <form className="loc-form" onSubmit={submit}>
              <input value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="Bv. 9000" aria-label="Postcode" maxLength="4" />
              <button className="btn btn-primary solid-white" type="submit">Check beschikbaarheid <Ico.arrow className="arr" width="18" height="18" /></button>
            </form>
            <p className="loc-note">Beschikbaar in de Benelux en Frankrijk · plaatsing in ongeveer 30 minuten.</p>
            <div className="loc-results">
              {shown && (
                <div className="loc-confirm" role="status">
                  <span className="lc-ico"><Ico.check width="22" height="22" /></span>
                  <div className="lc-body">
                    <div className="lc-ti">Bedankt, we bekijken de mogelijkheden in jouw regio{zip.trim() ? " (" + zip.trim() + ")" : ""}.</div>
                    <p className="lc-tx">Laat je gegevens achter en we nemen contact op over de mogelijkheden in jouw regio en een gratis, vrijblijvend adviesgesprek.</p>
                    <a className="btn btn-primary solid-white" href="#contact">Vraag gratis advies <Ico.arrow className="arr" width="18" height="18" /></a>
                  </div>
                </div>
              )}
            </div>
            <p className="loc-partner">Ben je zelf installateur? <a href="#contact" onClick={() => window.dispatchEvent(new CustomEvent("vt-topic", { detail: "partner" }))}>Word erkende VitaTap-partner →</a></p>
          </div>
          <div className="loc-map" aria-hidden="true">
            <svg className="loc-be" viewBox={"0 0 " + MAP.W + " " + MAP.H} preserveAspectRatio="xMidYMid meet" focusable="false">
              {REGION_ORDER.map((id) => (
                <path key={id} className={"loc-country" + (id === "BE" ? " home" : "")} d={MAP.paths[id]} />
              ))}
              {Object.entries(MAP.pins).map(([n, xy]) => (
                <g key={n} className={"loc-gpin" + (n === "Kortrijk" ? " hq" : "")}>
                  <circle className="ping" cx={xy[0]} cy={xy[1]} r="6" />
                  <circle className="dot" cx={xy[0]} cy={xy[1]} r={n === "Kortrijk" ? 4.5 : 3} />
                </g>
              ))}
            </svg>
            <span className="loc-map-cap">Benelux &amp; Frankrijk</span>
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
  { ph: "04", ti: "Service-ID", p: "We maken een digitale service-ID aan zodat je jaarlijkse onderhoud en calibratie vlot opgevolgd worden. Allemaal inbegrepen in je abonnement, jij hoeft nergens naar om te kijken.", chip: "Jaarlijks inbegrepen" },
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
  ["Wat is waterstofrijk water?", "Moleculaire waterstof (H₂) is een van nature voorkomend, smaakloos gas dat volledig opgelost in het water zit. Wetenschappelijk onderzoek naar moleculaire waterstof loopt volop; wij doen geen gezondheids- of medische claims. Wat vaststaat, zijn de gemeten waarden aan de uitloop: 1.200–1.600 ppb opgeloste H₂ en een ORP van −400/−600 mV. Dagelijks drinken is volkomen normaal. Je proeft zuiver, fris water."],
  ["Hoeveel water verbruikt het systeem?", "Zoals elk omgekeerde-osmosesysteem gebruikt VitaTap spoelwater om het membraan schoon te houden."],
  ["Hoe vaak moet het filter vervangen worden?", "De meeste filters gaan een jaar mee, maar elk onderdeel heeft zijn eigen levensduur. Vuistregels: sedimentfilter 3–12 maanden (afhankelijk van waterkwaliteit), koolfilter en remineralisatiefilter elk jaar, UV-lamp elk jaar, RO-membraan elke 3 jaar. Al dit onderhoud zit in het abonnement inbegrepen. De Blue Companion-app houdt automatisch bij wanneer vervanging nodig is."],
  ["Past de kraan op mijn bestaande keuken?", "In de meeste keukens wel. De kraan gebruikt een standaard 21 mm doorvoer en 3/8\"-aansluiting, en het systeem verdwijnt compact in je onderkast. Een erkende installateur controleert dit vooraf."],
  ["Wat is het verschil met een gewone waterfilter?", "Een gewone filter haalt alleen smaak en chloor weg. VitaTap zuivert moleculair en houdt verontreinigingen zoals PFAS, microplastics en bacteriën tot 99,9% tegen, remineraliseert daarna bewust en voegt moleculaire waterstof toe. Zuiver én vitaal, niet zomaar gefilterd."],
  ["Kan ik er ook bruiswater mee maken?", "Nee, en dat is bewust. VitaTap is gemaakt voor stil, zuiver en waterstofrijk water: net die zuivere smaak en de moleculaire waterstof (H₂) zijn wat je proeft en meet. Een carbonatiemodule zit dus niet in het toestel. Wil je af en toe toch bruis, dan gebruik je je gezuiverde VitaTap-water gewoon in een los bruistoestel — je vertrekt dan nog altijd van dezelfde zuivere basis."],
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
            <div className="foot-lockup">
              <Logo className="logo" />
              <div className="wordmark">VitaTap</div>
            </div>
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
