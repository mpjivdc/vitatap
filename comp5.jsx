/* global React, Ico */
const { useState: uS5, useEffect: uE5 } = React;

/* ----------------------------------------------------------------
   GRATIS ADVIES — lead form (alle CTA's landen hier)
----------------------------------------------------------------- */
const PLAN_OPTS = [
  ["", "Nog geen voorkeur"],
  ["m", "Maandelijks — €65 / mnd"],
  ["y", "Jaarlijks — €45 / mnd"],
  ["5", "5-jaarlijks — €39 / mnd"],
];

function Advies() {
  const [plan, setPlan] = uS5("");
  const [sent, setSent] = uS5(() => {
    try { return localStorage.getItem("vt-lead-sent") === "1"; } catch (e) { return false; }
  });
  const [firstName, setFirstName] = uS5(() => {
    try { return localStorage.getItem("vt-lead-name") || ""; } catch (e) { return ""; }
  });

  uE5(() => {
    const on = (e) => { setPlan(e.detail || ""); setSent(false); };
    window.addEventListener("vt-plan", on);
    return () => window.removeEventListener("vt-plan", on);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nm = String(fd.get("naam") || "").trim().split(" ")[0];
    setFirstName(nm);
    setSent(true);
    try {
      localStorage.setItem("vt-lead-sent", "1");
      localStorage.setItem("vt-lead-name", nm);
    } catch (err) { /* private mode */ }
  };
  const reset = () => {
    setSent(false);
    try { localStorage.setItem("vt-lead-sent", "0"); } catch (err) { /* noop */ }
  };

  return (
    <section className="section advies bg-paper2" id="contact" data-screen-label="Gratis advies">
      <div className="wrap advies-grid">
        <div className="advies-copy">
          <p className="eyebrow">10 — Gratis advies</p>
          <h2 className="display" style={{ fontSize: "clamp(32px,4vw,52px)", marginTop: 16 }}>Eerst advies,<br />dan beslissen.</h2>
          <p className="lead" style={{ marginTop: 18 }}>Laat je gegevens achter en we contacteren je binnen 2 werkdagen voor een gratis en vrijblijvend adviesgesprek — op een moment dat jou past.</p>
          <ul className="advies-points">
            <li><Ico.check className="ck" /><span>Een <b>erkende installateur uit jouw regio</b> bekijkt je keuken en aansluiting</span></li>
            <li><Ico.check className="ck" /><span>Op afspraak — <b>bij jou thuis of telefonisch</b>, zoals je zelf wil</span></li>
            <li><Ico.check className="ck" /><span><b>Volledig vrijblijvend.</b> Geen aankoopverplichting, geen opdringerige opvolging</span></li>
          </ul>
        </div>

        {sent ? (
          <div className="advies-form success">
            <span className="ok"><Ico.check width="30" height="30" /></span>
            <h3>Bedankt{firstName ? ", " + firstName : ""}!</h3>
            <p>Je aanvraag is goed ontvangen. We bellen of mailen je binnen 2 werkdagen om een gratis en vrijblijvend adviesgesprek in te plannen.</p>
            <button className="btn btn-ghost" onClick={reset} style={{ marginTop: 14 }}>Nieuwe aanvraag</button>
          </div>
        ) : (
          <form className="advies-form" onSubmit={submit}>
            <div className="f-row">
              <label>Naam
                <input name="naam" type="text" autoComplete="name" placeholder="Voor- en achternaam" required />
              </label>
              <label>Telefoon
                <input name="telefoon" type="tel" autoComplete="tel" placeholder="+32 ..." required />
              </label>
            </div>
            <label>E-mail
              <input name="email" type="email" autoComplete="email" placeholder="jij@voorbeeld.be" required />
            </label>
            <div className="f-row">
              <label>Postcode
                <input name="postcode" inputMode="numeric" maxLength="6" placeholder="Bv. 9000" required />
              </label>
              <label>Interesse
                <select name="plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
                  {PLAN_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
            </div>
            <label>Vraag of opmerking <span className="opt">(optioneel)</span>
              <textarea name="bericht" placeholder="Bv. type keukenblad, huidige kraan, beste belmoment..."></textarea>
            </label>
            <button className="btn btn-primary" type="submit">Plan mijn gratis adviesgesprek <Ico.arrow className="arr" width="18" height="18" /></button>
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
      <div className="sc-price"><b>Vanaf €39 / mnd</b><span>Alles inbegrepen</span></div>
      <a className="btn btn-primary" href="#contact" tabIndex={show ? 0 : -1}>Gratis advies <Ico.arrow className="arr" width="16" height="16" /></a>
    </div>
  );
}

Object.assign(window, { Advies, StickyCTA });
