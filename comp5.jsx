/* global React, Ico */
const { useState: uS5, useEffect: uE5 } = React;

/* ----------------------------------------------------------------
   GRATIS ADVIES - lead form (alle CTA's landen hier)
----------------------------------------------------------------- */
const PLAN_OPTS = [
  ["", "Nog geen voorkeur"],
  ["m", "Maandelijks · €65 / mnd (€78,65 incl. btw)"],
  ["y", "Jaarlijks · €45 / mnd (€54,45 incl. btw)"],
  ["5", "5-jaarlijks · €39 / mnd (€47,19 incl. btw)"],
];

const W3F_KEY = "2ad121b7-621a-4eb7-864f-3b7e6e63945e";
// BCP lead intake since 2026-09-01: Supabase Edge Function `web-lead` -> the app's own
// leads table (was: Apps Script -> BCP_INVENTORY_DB sheet). Same {ok} contract, same
// bot-deterrence token model (public by design), plus server-side volume caps.
const INTAKE_URL = "https://hblhalopooblmzrdwokt.supabase.co/functions/v1/web-lead";
const INTAKE_TOKEN = "a2b4c082193dfa8ea51d581274881f410d1aa48e37915dae";
const INTAKE_TIMEOUT_MS = 6000;

// Installation area: Benelux + France (Maarten, 2026-10-30). BE and LU postcodes are both
// 4 digits, so the country is asked, not guessed. The same patterns are enforced again in
// the web-lead Edge Function; keep the two in step.
const COUNTRIES = [
  ["BE", "België", "[0-9]{4}", "numeric", "Bv. 9000", "Een Belgische postcode bestaat uit 4 cijfers"],
  ["NL", "Nederland", "[0-9]{4} ?[A-Za-z]{2}", "text", "Bv. 1234 AB", "Een Nederlandse postcode bestaat uit 4 cijfers en 2 letters"],
  ["LU", "Luxemburg", "([Ll]-?)?[0-9]{4}", "text", "Bv. 1234", "Een Luxemburgse postcode bestaat uit 4 cijfers"],
  ["FR", "Frankrijk", "[0-9]{5}", "numeric", "Bv. 75001", "Een Franse postcode bestaat uit 5 cijfers"],
];

function Advies() {
  const [plan, setPlan] = uS5("");
  const [land, setLand] = uS5("BE");
  const pc = COUNTRIES.find((c) => c[0] === land);
  const [sent, setSent] = uS5(() => {
    try { return localStorage.getItem("vt-lead-sent") === "1"; } catch (e) { return false; }
  });
  const [firstName, setFirstName] = uS5(() => {
    try { return localStorage.getItem("vt-lead-name") || ""; } catch (e) { return ""; }
  });
  const [loading, setLoading] = uS5(false);
  const [error, setError] = uS5("");
  const [bericht, setBericht] = uS5("");

  uE5(() => {
    const on = (e) => { setPlan(e.detail || ""); setSent(false); };
    const onTopic = (e) => {
      if (e.detail === "partner") {
        setPlan("");
        setBericht("Ik ben installateur en wil graag meer weten over een samenwerking met VitaTap.");
        setSent(false);
      }
    };
    window.addEventListener("vt-plan", on);
    window.addEventListener("vt-topic", onTopic);
    return () => { window.removeEventListener("vt-plan", on); window.removeEventListener("vt-topic", onTopic); };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.target);
    const nm = String(fd.get("voornaam") || "").trim();

    // --- 1. Lead intake into Supabase (leads table via the web-lead Edge Function),
    // AWAITED, {ok} read. Name and address travel as COMPONENTS (voornaam/achternaam,
    // straat/huisnummer/postcode/gemeente) because the database stores them that way
    // (full_name is a generated column). text/plain keeps the request preflight-free;
    // the function parses the JSON body regardless of content type.
    let intakeStatus = "unknown";
    const ac = new AbortController();
    const killer = setTimeout(() => ac.abort(), INTAKE_TIMEOUT_MS);
    try {
      const r = await fetch(INTAKE_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          token: INTAKE_TOKEN,
          first_name: fd.get("voornaam"),
          last_name: fd.get("achternaam"),
          email: fd.get("email"),
          phone: fd.get("telefoon"),
          street: fd.get("straat"),
          house_number: fd.get("huisnummer"),
          postcode: fd.get("postcode"),
          city: fd.get("gemeente"),
          country: land,
          // Real honeypot (named vt_hp so password managers do not fill it).
          website: fd.get("vt_hp") || "",
          message: fd.get("bericht") || "",
          gdpr_consent: fd.get("consent") != null,
        }),
        signal: ac.signal,
      });
      const j = await r.json();
      intakeStatus = j && j.ok === true ? "ok" : "rejected";
    } catch (err) {
      intakeStatus = ac.signal.aborted ? "timeout" : "unreachable";
    } finally {
      clearTimeout(killer);
    }

    // --- 2. web3forms notification. Carries the intake result, so a lead that
    // did not reach the sheet announces itself in the mail that does arrive.
    const payload = {
      access_key: W3F_KEY,
      subject: intakeStatus === "ok"
        ? "Nieuwe adviesaanvraag via de website"
        : "LET OP: adviesaanvraag NIET in de database (" + intakeStatus + ")",
      from_name: "VitaTap website",
      voornaam: fd.get("voornaam"),
      achternaam: fd.get("achternaam"),
      email: fd.get("email"),
      telefoon: fd.get("telefoon"),
      straat: fd.get("straat"),
      huisnummer: fd.get("huisnummer"),
      postcode: fd.get("postcode"),
      gemeente: fd.get("gemeente"),
      land: land,
      interesse: fd.get("plan") || "Geen voorkeur",
      bericht: fd.get("bericht") || "",
      intake_status: intakeStatus,
    };

    let mailOk = false;
    let mailReached = true;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      mailOk = data.success === true;
    } catch (err) {
      mailReached = false;
    }

    // The visitor is told it worked if EITHER channel worked - in both of those
    // cases we really do have the request. Only a double failure is a real loss,
    // and only then is the visitor asked to retry (which also stops the old
    // behaviour of showing an error, and inviting a duplicate, when the lead was
    // in fact recorded).
    if (mailOk || intakeStatus === "ok") {
      setFirstName(nm);
      setSent(true);
      try {
        localStorage.setItem("vt-lead-sent", "1");
        localStorage.setItem("vt-lead-name", nm);
      } catch (err) { /* private mode */ }
    } else if (!mailReached && intakeStatus !== "rejected") {
      setError("Geen verbinding. Controleer je internet en probeer opnieuw.");
    } else {
      setError("Er ging iets mis. Probeer het opnieuw of mail ons rechtstreeks.");
    }
    setLoading(false);
  };
  const reset = () => {
    setSent(false);
    setError("");
    try { localStorage.setItem("vt-lead-sent", "0"); } catch (err) { /* noop */ }
  };

  return (
    <section className="section advies bg-paper2" id="contact" data-screen-label="Gratis advies">
      <div className="wrap advies-grid">
        <div className="advies-copy">
          <p className="eyebrow">10 · Gratis advies</p>
          <h2 className="display" style={{ fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Eerst advies,<br />dan beslissen.</h2>
          <p className="lead" style={{ marginTop: 18 }}>Laat je gegevens achter en we contacteren je binnen 2 werkdagen voor een gratis en vrijblijvend adviesgesprek, op een moment dat jou past.</p>
            <ul className="advies-points">
            <li><Ico.check className="ck" /><span>Een <b>VitaTap-installateur uit jouw regio</b> bekijkt je keuken en aansluiting</span></li>
            <li><Ico.check className="ck" /><span>Op afspraak: <b>bij jou thuis of telefonisch</b>, zoals je zelf wil</span></li>
            <li><Ico.check className="ck" /><span><b>Volledig vrijblijvend.</b> Geen aankoopverplichting, geen opdringerige opvolging</span></li>
          </ul>
        </div>

        {sent ? (
          <div className="advies-form success" role="status" aria-live="polite">
            <span className="ok"><Ico.check width="30" height="30" /></span>
            <h3>Bedankt{firstName ? ", " + firstName : ""}!</h3>
            <p>Je aanvraag is goed ontvangen. We bellen of mailen je binnen 2 werkdagen om een gratis en vrijblijvend adviesgesprek in te plannen.</p>
            <button className="btn btn-ghost" onClick={reset} style={{ marginTop: 14 }}>Nieuwe aanvraag</button>
          </div>
        ) : (
          <form className="advies-form" onSubmit={submit}>
            <div className="f-row">
              <label>Voornaam
                <input name="voornaam" type="text" autoComplete="given-name" placeholder="Bv. Jan" required />
              </label>
              <label>Achternaam
                <input name="achternaam" type="text" autoComplete="family-name" placeholder="Bv. Peeters" required />
              </label>
            </div>
            <div className="f-row">
              <label>Telefoon
                <input name="telefoon" type="tel" autoComplete="tel" placeholder="+32 ..." required />
              </label>
              <label>E-mail
                <input name="email" type="email" autoComplete="email" placeholder="jij@voorbeeld.be" required />
              </label>
            </div>
            <div className="f-row">
              <label>Straat
                <input name="straat" type="text" autoComplete="address-line1" placeholder="Bv. Kerkstraat" required />
              </label>
              <label>Nr.
                <input name="huisnummer" type="text" placeholder="Bv. 12A" required />
              </label>
            </div>
            <label>Land
              <select name="land" value={land} onChange={(e) => setLand(e.target.value)}>
                {COUNTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <div className="f-row">
              <label>Postcode
                <input name="postcode" inputMode={pc[3]} maxLength="7" pattern={pc[2]} title={pc[5]} placeholder={pc[4]} autoComplete="postal-code" onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9A-Za-z -]/g, "").toUpperCase().slice(0, 7); }} required />
              </label>
              <label>Gemeente
                <input name="gemeente" type="text" autoComplete="address-level2" placeholder="Bv. Gent" required />
              </label>
            </div>
            <label>Interesse
              <select name="plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
                {PLAN_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label>Vraag of opmerking <span className="opt">(optioneel)</span>
              <textarea name="bericht" value={bericht} onChange={(e) => setBericht(e.target.value)} placeholder="Bv. type keukenblad, huidige kraan, beste belmoment..."></textarea>
            </label>
            {/* Honeypot: off-screen, not focusable, not autofilled. Named vt_hp rather
                than "website" so password managers do not fill it and drop real leads. */}
            <input name="vt_hp" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
            <label className="consent">
              <input name="consent" type="checkbox" required />
              <span>Ik ga akkoord dat VitaTap mijn gegevens gebruikt om mijn adviesaanvraag te behandelen, zoals beschreven in het <a href="privacy.html" target="_blank" rel="noopener">privacybeleid</a>.</span>
            </label>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Versturen..." : <span>Plan mijn gratis adviesgesprek <Ico.arrow className="arr" width="18" height="18" /></span>}
            </button>
            {error && <p className="form-note form-error" role="alert">{error}</p>}
            <p className="form-note">Binnen 2 werkdagen contact · gratis &amp; vrijblijvend</p>
          </form>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   STICKY MOBILE CTA
----------------------------------------------------------------- */
function StickyCTA() {
  const [show, setShow] = uS5(false);
  uE5(() => {
    let scrolled = false, formVisible = false;
    const update = () => setShow(scrolled && !formVisible);
    const onScroll = () => { scrolled = window.scrollY > 560; update(); };
    const el = document.getElementById("contact");
    const io = el ? new IntersectionObserver((ents) => { formVisible = ents[0].isIntersecting; update(); }, { threshold: 0.05 }) : null;
    if (io && el) io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); if (io) io.disconnect(); };
  }, []);
  return (
    <div className={"sticky-cta" + (show ? " show" : "")} aria-hidden={!show}>
      <div className="sc-price"><b>Vanaf €39 / mnd excl. btw</b><span>€47,19 incl. btw · alles inbegrepen</span></div>
      <a className="btn btn-primary" href="#contact" tabIndex={show ? 0 : -1}>Gratis advies <Ico.arrow className="arr" width="16" height="16" /></a>
    </div>
  );
}

Object.assign(window, { Advies, StickyCTA });
