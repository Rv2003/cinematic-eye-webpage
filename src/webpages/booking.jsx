import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router';
import { Navbar } from '../components/navbar';
import './booking.css';
import slide1 from '../assets/DSC_0056.jpg';
import slide2 from '../assets/DSC_7866.png';
import slide3 from '../assets/DSC_9597.jpg';
import { useNavigate } from 'react-router';
const slides = [
  { src: slide1, caption: 'Light, shadow, and deliberate framing.' },
  { src: slide2, caption: 'Editorial precision meets cinematic depth.' },
  { src: slide3, caption: 'Every session starts with a story.' },
];

const packages = [
  {
    id: 'editorial',
    name: 'Editorial',
    duration: 'Half / Full Day',
    tagline: 'Fashion, magazine & styled direction',
  },
  {
    id: 'documentary',
    name: 'Documentary',
    duration: 'Multi-day',
    tagline: 'Observational, long-form storytelling',
  },
  {
    id: 'commercial',
    name: 'Commercial',
    duration: 'Project-based',
    tagline: 'Brand films & campaign production',
  },
  {
    id: 'portrait',
    name: 'Portrait',
    duration: '2–4 Hours',
    tagline: 'Headshots, personal & creative sessions',
  },
];

const steps = ['Session', 'Schedule', 'Details', 'Review'];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  location: 'studio',
  date: '',
  time: '',
  notes: '',
};

export function Booking({ user, setUser, token, setToken }) {
  const [loaded, setLoaded] = useState(false);
  const [slide, setSlide] = useState(0);
  const [step, setStep] = useState(0);
  const [pkg, setPkg] = useState(packages[0].id);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const navigate=useNavigate()


  

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const selected = packages.find((p) => p.id === pkg);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const canAdvance = () => {
    if (step === 0) return !!pkg;
    if (step === 1) return form.date && form.location;
    if (step === 2) return form.name.trim() && form.email.trim();
    return true;
  };

  const next = () => {
    if (step < steps.length - 1 && canAdvance()) setStep((s) => s + 1);
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      // await axios.post('/api/bookings', { package: pkg, ...form });
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  const locationLabel = {
    studio: 'Cinematic Eye Studio',
    'on-location': 'On Location',
    undecided: 'To be confirmed',
  };
if(!user){
   navigate("/login")
}
  return (
    <>
      <Navbar user={user} setUser={setUser} token={token} setToken={setToken} />

      <div className={`bk ${loaded ? 'bk--ready' : ''}`}>
        {/* ── Left: cinematic panel ── */}
        <aside className="bk-visual" aria-hidden={step > 0 ? undefined : undefined}>
          {slides.map((s, i) => (
            <div key={i} className={`bk-slide ${i === slide ? 'bk-slide--active' : ''}`}>
              <img src={s.src} alt="" className="bk-slide-img" />
            </div>
          ))}
          <div className="bk-visual-vignette" />
          <div className="bk-visual-content">
            <Link to="/" className="bk-brand">
              <span className="bk-brand-light">CINEMATIC</span>
              <span className="bk-brand-dot" />
              <span className="bk-brand-bold">EYE</span>
            </Link>
            <p className="bk-visual-quote">{slides[slide].caption}</p>
          </div>
          <div className="bk-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`bk-dot ${i === slide ? 'bk-dot--active' : ''}`}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </aside>

        {/* ── Right: booking wizard ── */}
        <main className="bk-panel">
          {status === 'done' ? (
            <div className="bk-success">
              <div className="bk-success-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="bk-eyebrow">
                <span className="bk-eyebrow-dot" />
                Request received
              </span>
              <h1 className="bk-success-title">
                YOU&apos;RE <span className="bk-gold">ON THE LIST</span>
              </h1>
              <p className="bk-success-text">
                We&apos;ll reach out within one business day to confirm your {selected?.name.toLowerCase()} session.
              </p>
              <Link to="/" className="bk-btn bk-btn--primary">
                <span>Return home</span>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="bk-panel-inner">
              <header className="bk-header">
                <span className="bk-eyebrow">
                  <span className="bk-eyebrow-dot" />
                  Book a session
                </span>
                <h1 className="bk-heading">
                  LOCK IN <span className="bk-gold">YOUR SHOOT</span>
                </h1>
              </header>

              {/* Step progress */}
              <nav className="bk-steps" aria-label="Booking progress">
                {steps.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    className={`bk-step ${i === step ? 'bk-step--current' : ''} ${i < step ? 'bk-step--done' : ''}`}
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                  >
                    <span className="bk-step-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="bk-step-label">{label}</span>
                  </button>
                ))}
                <div className="bk-steps-track">
                  <div className="bk-steps-fill" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
                </div>
              </nav>

              <form className="bk-form" onSubmit={submit}>
                {/* Step 0 — Session */}
                {step === 0 && (
                  <div className="bk-step-content">
                    <p className="bk-step-desc">Select the type of production you&apos;re planning.</p>
                    <div className="bk-packages">
                      {packages.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className={`bk-pkg ${pkg === p.id ? 'bk-pkg--selected' : ''}`}
                          onClick={() => setPkg(p.id)}
                        >
                          <span className="bk-pkg-duration">{p.duration}</span>
                          <span className="bk-pkg-name">{p.name}</span>
                          <span className="bk-pkg-tag">{p.tagline}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1 — Schedule */}
                {step === 1 && (
                  <div className="bk-step-content">
                    <p className="bk-step-desc">When and where would you like to shoot?</p>
                    <div className="bk-fields">
                      <div className="bk-field">
                        <label htmlFor="date">Preferred date</label>
                        <input type="date" id="date" name="date" value={form.date} onChange={update} required />
                      </div>
                      <div className="bk-field">
                        <label htmlFor="time">Preferred time</label>
                        <input type="time" id="time" name="time" value={form.time} onChange={update} />
                      </div>
                      <div className="bk-field bk-field--full">
                        <label htmlFor="location">Shoot location</label>
                        <select id="location" name="location" value={form.location} onChange={update}>
                          <option value="studio">Cinematic Eye Studio — Colombo</option>
                          <option value="on-location">On Location</option>
                          <option value="undecided">Not sure yet</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 — Details */}
                {step === 2 && (
                  <div className="bk-step-content">
                    <p className="bk-step-desc">How can we reach you, and what should we know?</p>
                    <div className="bk-fields">
                      <div className="bk-field">
                        <label htmlFor="name">Full name</label>
                        <input type="text" id="name" name="name" placeholder="Your name" value={form.name} onChange={update} required />
                      </div>
                      <div className="bk-field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="your@email.com" value={form.email} onChange={update} required />
                      </div>
                      <div className="bk-field bk-field--full">
                        <label htmlFor="phone">Phone <span className="bk-optional">(optional)</span></label>
                        <input type="tel" id="phone" name="phone" placeholder="+94 7X XXX XXXX" value={form.phone} onChange={update} />
                      </div>
                      <div className="bk-field bk-field--full">
                        <label htmlFor="notes">About the shoot</label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={4}
                          placeholder="Mood, references, team size, deliverables..."
                          value={form.notes}
                          onChange={update}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 — Review */}
                {step === 3 && (
                  <div className="bk-step-content">
                    <p className="bk-step-desc">Review your request before sending.</p>
                    <dl className="bk-review">
                      <div className="bk-review-row">
                        <dt>Session</dt>
                        <dd>{selected?.name} — {selected?.duration}</dd>
                      </div>
                      <div className="bk-review-row">
                        <dt>Date</dt>
                        <dd>{form.date || '—'}{form.time ? ` at ${form.time}` : ''}</dd>
                      </div>
                      <div className="bk-review-row">
                        <dt>Location</dt>
                        <dd>{locationLabel[form.location]}</dd>
                      </div>
                      <div className="bk-review-row">
                        <dt>Contact</dt>
                        <dd>{form.name} · {form.email}</dd>
                      </div>
                      {form.notes && (
                        <div className="bk-review-row bk-review-row--block">
                          <dt>Notes</dt>
                          <dd>{form.notes}</dd>
                        </div>
                      )}
                    </dl>
                    <p className="bk-review-note">
                      A 30% deposit confirms your date. We respond within one business day.
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="bk-nav">
                  {step > 0 ? (
                    <button type="button" className="bk-btn bk-btn--ghost" onClick={back}>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Back</span>
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < steps.length - 1 ? (
                    <button type="button" className="bk-btn bk-btn--primary" onClick={next} disabled={!canAdvance()}>
                      <span>Continue</span>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ) : (
                    <button type="submit" className="bk-btn bk-btn--primary" disabled={status === 'submitting'}>
                      <span>{status === 'submitting' ? 'Sending...' : 'Send request'}</span>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </>)

        }