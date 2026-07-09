import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchColleges } from '../services/api';
import {
  FaGraduationCap, FaAward, FaUserCheck,
  FaChevronRight, FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt,
} from 'react-icons/fa';
import bgImg from '../assets/BG.png';
import PageTransition from '../components/common/PageTransition';

const SERVICES = [
  { icon: '🎓', title: 'Admission Guidance', desc: 'Expert guidance through the complex admission process for engineering, medical, and allied programs across Tamil Nadu.' },
  { icon: '🎯', title: 'Career Counselling', desc: 'Personalised one-on-one sessions to match your interests and strengths with the right academic path.' },
  { icon: '📚', title: 'Course Selection', desc: 'Choose from a broad spectrum of programs that align with your academic background and career ambitions.' },
  { icon: '💰', title: 'Scholarship Support', desc: 'Assistance in securing merit-based and need-based scholarships ranging from ₹5,000 to ₹25,000.' },
  { icon: '📝', title: 'Documentation Help', desc: 'Full support for application forms, statement of purpose, and all required documentation — stress-free.' },
];

const PROCESS_STEPS = [
  { number: '01', title: 'Free Consultation', desc: 'Discuss your academic goals and interests with our experienced counsellors — no charges.' },
  { number: '02', title: 'Profile Analysis', desc: 'Comprehensive evaluation of your scores to match you with the best-fit colleges and programs.' },
  { number: '03', title: 'Documentation', desc: 'We handle the paperwork — application forms, certificates, and submission — end to end.' },
  { number: '04', title: 'Admission Secured', desc: 'Get your confirmation letter and secure your seat at your dream college with our support.' },
];

const MARQUEE_ITEMS = [
  'Engineering', 'Medical (MBBS)', 'Nursing', 'Allied Health Sciences',
  'Arts & Science', 'Polytechnic', 'Law', 'Architecture', 'MBA', 'Pharmacy',
];

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (location.state?.success) {
      setToast({ show: true, message: location.state.message || 'Application submitted!', type: 'success' });
    } else if (location.state?.error) {
      setToast({ show: true, message: location.state.message || 'Something went wrong.', type: 'error' });
    }
  }, [location.state]);

  useEffect(() => {
    const t = setTimeout(() => setShowPopup(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchColleges();
        const list = (Array.isArray(data) ? data : data.results || []).slice(0, 6).map(c => ({
          ...c,
          displayImage: c.cover_image || c.college_images?.[0] || c.logo_url || null,
        }));
        setColleges(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PageTransition>
      <div className="home-container">

        {/* ══════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════ */}
        <section className="hero-split-new" style={{ position: 'relative' }}>

          {/* Background image + overlay */}
          <div className="hero-background" style={{ zIndex: 0 }}>
            <div className="hero-bg-image-wrapper">
              <img src={bgImg} alt="" className="hero-full-img" aria-hidden="true" />
            </div>
            <div className="hero-bg-overlay" />
          </div>

          {/* Decorative blobs */}
          <div className="hero-bg-deco" aria-hidden="true" />

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="hero-split-wrap">

              {/* Left column */}
              <div className="hero-split-left-new">
                {/* Eyebrow */}
                <div className="hero-badge">
                  <span className="badge-pulse" />
                  Admissions {new Date().getFullYear()}–{new Date().getFullYear() + 1} Open
                </div>

                {/* Headline */}
                <h1 className="hero-title">
                  Your Journey to a<br />
                  <span className="highlight">Dream College</span> Starts Here
                </h1>

                {/* Sub */}
                <p className="hero-desc">
                  Mari Educational Trust provides expert admission guidance, scholarship
                  assistance, and reliable counselling — empowering students across Tamil Nadu
                  to reach their professional goals.
                </p>

                {/* CTAs */}
                <div className="hero-buttons">
                  <Link to="/apply" className="btn-primary">
                    Apply for Admission <FaChevronRight size={11} />
                  </Link>
                  <Link to="/colleges" className="btn-secondary">
                    Explore Colleges
                  </Link>
                </div>

                {/* Trust metrics */}
                <div className="hero-trust">
                  {[
                    { value: 'Govt.', label: 'Registered MSME' },
                    { value: '5k–25k', label: 'Scholarship Support' },
                    { value: '100%', label: 'Dedicated Guidance' },
                  ].map((item, idx) => (
                    <div key={idx} className="trust-item">
                      <span className="trust-num">{item.value}</span>
                      <span className="trust-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column — notification card */}
              <div className="hero-split-right-new" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="hero-premium-glass-card" style={{ maxWidth: 390, width: '100%' }}>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>★</span>
                    Active Notifications
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      {
                        icon: <FaGraduationCap color="#2563eb" size={17} />,
                        bg: '#eff6ff',
                        title: 'Engineering Admissions',
                        desc: 'B.E / B.Tech counselling support is now active.',
                      },
                      {
                        icon: <FaAward color="#f59e0b" size={17} />,
                        bg: '#fef3c7',
                        title: 'Scholarship Registration',
                        desc: 'Secure merit-based scholarship slots for 2024–25.',
                      },
                      {
                        icon: <FaUserCheck color="#10b981" size={17} />,
                        bg: '#d1fae5',
                        title: 'Medical Placements',
                        desc: 'MBBS & Allied Health assistance is open now.',
                      },
                    ].map((note, idx) => (
                      <div key={idx} className="notif-card">
                        <div className="notif-icon-box" style={{ background: note.bg }}>
                          {note.icon}
                        </div>
                        <div>
                          <div className="notif-title">{note.title}</div>
                          <p className="notif-desc">{note.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <Link
                      to="/apply"
                      className="glass-btn-hover"
                      style={{
                        display: 'block',
                        padding: '11px',
                        background: '#eff6ff',
                        border: '1px solid #dbeafe',
                        borderRadius: 12,
                        color: '#1d4ed8',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        textAlign: 'center',
                      }}
                    >
                      Fill Direct Application →
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
          MARQUEE
          ══════════════════════════════════════ */}
        <section className="marquee-section" aria-hidden="true">
          <div className="marquee-wrapper">
            {[0, 1].map(key => (
              <div key={key} className="marquee-track">
                {MARQUEE_ITEMS.map((item, i) => (
                  <span key={i} className="marquee-item">
                    <span className="marquee-dot">◆</span>
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════════════════════════════
          SERVICES
          ══════════════════════════════════════ */}
        <section className="services-section">
          <div className="services-container">
            <div className="section-header-centered">
              <div className="section-label-premium">
                <span className="label-dot" /> Our Expertise
              </div>
              <h2 className="section-title-premium">
                Services We <span className="title-highlight">Offer</span>
              </h2>
              <p className="section-subtitle-premium">
                End-to-end admission support so your university journey begins on the right foot.
              </p>
            </div>

            <div className="services-grid">
              {SERVICES.map((svc, i) => (
                <div key={i} className="service-card">
                  <div className="service-icon-wrapper">
                    <div className="service-icon-bg">
                      <span className="service-icon" role="img" aria-label={svc.title}>{svc.icon}</span>
                    </div>
                  </div>
                  <h3 className="service-card-title">{svc.title}</h3>
                  <p className="service-card-desc">{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
          PROCESS
          ══════════════════════════════════════ */}
        <section className="process-section">
          <div className="process-container">
            <div className="section-header-centered">
              <div className="section-label-premium">
                <span className="label-dot" /> How We Work
              </div>
              <h2 className="section-title-premium">
                Our Guided <span className="title-highlight">Process</span>
              </h2>
              <p className="section-subtitle-premium">
                A clear four-step journey from consultation to confirmed admission.
              </p>
            </div>

            <div className="process-steps">
              {PROCESS_STEPS.map((step, i) => (
                <div key={i} className="process-step-item">
                  <div className="step-number-box">
                    <span className="step-number">{step.number}</span>
                  </div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
          PARTNER COLLEGES
          ══════════════════════════════════════ */}
        {!loading && colleges.length > 0 && (
          <section className="colleges-grid-section">
            <div className="container">
              <div className="section-header-flex">
                <div>
                  <h2 className="section-title-premium" style={{ margin: 0 }}>
                    Partner <span className="title-highlight">Colleges</span>
                  </h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: '0.92rem' }}>
                    A preview of top institutions we guide students into.
                  </p>
                </div>
                <Link to="/colleges" className="see-all-link">
                  View All Colleges →
                </Link>
              </div>

              <div className="colleges-grid">
                {colleges.map(college => (
                  <div key={college.id} className="college-card">
                    <div className="college-card-image">
                      {college.displayImage
                        ? <img src={college.displayImage} alt={college.name} />
                        : <div className="college-img-placeholder">🏛️</div>
                      }
                      <span className="college-card-badge">
                        {college.accreditation || 'Accredited'}
                      </span>
                    </div>
                    <div className="college-card-body">
                      <h3 className="college-card-name">{college.name}</h3>
                      <p className="college-card-location">
                        <FaMapMarkerAlt size={12} color="#f59e0b" />
                        {college.location || 'Tamil Nadu'}
                      </p>
                      <div className="college-card-actions">
                        <Link to={`/colleges/${college.slug}`} className="btn-view">
                          View Details
                        </Link>
                        <Link
                          to={`/apply?college=${college.id}`}
                          className="btn-dark btn-sm"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* ══════════════════════════════════════
          CTA / CONTACT
          ══════════════════════════════════════ */}
        <section className="success-cta-section">
          <div className="success-bg-orb orb-1" />
          <div className="success-bg-orb orb-2" />

          <div className="success-cta-inner">
            <div className="success-cta-header">
              <div className="success-badge">
                <span className="badge-star">★</span> Registered Education Consultant
              </div>
              <h2 className="success-cta-title">
                Start Your <span className="success-highlight">Success Story</span> Today
              </h2>
              <p className="success-cta-sub">
                Get verified counselling and application assistance from{' '}
                <strong>Mari Educational Trust</strong>. We make admissions simple and secure.
              </p>
            </div>

            <div className="success-contact-grid">
              {[
                {
                  icon: <FaPhoneAlt size={18} />,
                  label: 'Call Support',
                  val: '9843139330',
                  sub: '9:00 AM – 6:30 PM, Mon–Sat',
                  color: '#2563eb',
                  action: 'tel:+919843139330',
                  actionLabel: 'Call Now',
                },
                {
                  icon: <FaWhatsapp size={18} />,
                  label: 'WhatsApp Us',
                  val: '9941489330',
                  sub: 'Instant reply & document sharing',
                  color: '#16a34a',
                  action: 'https://wa.me/919941489330',
                  actionLabel: 'Open Chat',
                  external: true,
                },
                {
                  icon: <FaMapMarkerAlt size={18} />,
                  label: 'Visit Office',
                  val: 'Perambalur, TN',
                  sub: '7/273, Malayadivaram, Alathur',
                  color: '#f59e0b',
                  action: '/contact',
                  actionLabel: 'View Map',
                  internal: true,
                },
              ].map((card, i) => (
                <div key={i} className="success-contact-card">
                  <div className="contact-card-glow" style={{ background: card.color }} />
                  <div
                    className="contact-card-icon"
                    style={{ background: `${card.color}18`, color: card.color }}
                  >
                    {card.icon}
                  </div>
                  <div className="contact-card-label" style={{ color: 'var(--text-faint)' }}>
                    {card.label}
                  </div>
                  <div className="contact-card-line">{card.val}</div>
                  <p className="contact-card-sub">{card.sub}</p>
                  {card.internal
                    ? <Link to={card.action} className="contact-card-btn" style={{ background: card.color }}>{card.actionLabel}</Link>
                    : <a href={card.action} className="contact-card-btn" style={{ background: card.color }} target="_blank" rel="noreferrer">{card.actionLabel}</a>
                  }
                </div>
              ))}
            </div>

            <div className="success-cta-bottom">
              <Link to="/apply" className="success-main-btn">
                <span className="btn-shimmer" />
                Get Free Consultation
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 17, height: 17 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <p className="success-cta-fine">
                No registration fee for counselling · Official partner for top academic branches
              </p>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
          ANNOUNCEMENT POPUP
          ══════════════════════════════════════ */}
        {showPopup && (
          <div className="popup-overlay" onClick={() => setShowPopup(false)}>
            <div className="popup-container" onClick={e => e.stopPropagation()}>
              <button className="popup-close" onClick={() => setShowPopup(false)}>✕</button>

              <div style={{ fontSize: '3rem', marginBottom: 14 }}>🎓</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.35rem', fontWeight: 800, marginBottom: 10 }}>
                Mari Educational Trust
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 24 }}>
                Admissions for the upcoming academic session are now open. Get personalised
                counselling, course selection, and scholarship mapping — all for free.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link
                  to="/apply"
                  onClick={() => setShowPopup(false)}
                  className="btn-primary"
                  style={{ display: 'block', textAlign: 'center', padding: '12px 24px', borderRadius: 12 }}
                >
                  Register for Admission Support
                </Link>
                <button
                  onClick={() => setShowPopup(false)}
                  style={{
                    background: 'transparent',
                    border: '1.5px solid var(--border)',
                    color: 'var(--text-muted)',
                    borderRadius: 999,
                    padding: '10px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                  }}
                >
                  Explore First
                </button>
              </div>
            </div>
          </div>
        )}


        {/* ── Scroll to Top ── */}
        {showScrollTop && (
          <button
            className="scroll-to-top show"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" />
            </svg>
          </button>
        )}


        {/* ── Toast ── */}
        {toast.show && (
          <div className={`toast toast--${toast.type}`}>
            {toast.message}
            <button
              onClick={() => setToast({ show: false, message: '', type: '' })}
              style={{ background: 'none', border: 'none', color: 'var(--text-faint)', marginLeft: 12, cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
