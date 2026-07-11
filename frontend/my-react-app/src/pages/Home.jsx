import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchColleges } from '../services/api';
import {
  FaChevronRight, FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt,
  FaArrowRight,
} from 'react-icons/fa';
import catEngineering from '../assets/categories/cat_engineering.jpg';
import catPolytechnic from '../assets/categories/cat_polytechnic.jpg';
import catComputerApplications from '../assets/categories/cat_computer_applications.jpg';
import catMedical from '../assets/categories/cat_medical.jpg';
import catNursing from '../assets/categories/cat_nursing.jpg';
import catAlliedHealth from '../assets/categories/cat_allied_health.jpg';
import catPhysiotherapy from '../assets/categories/cat_physiotherapy.jpg';
import catOccupationalTherapy from '../assets/categories/cat_occupational_therapy.jpg';
import catArtsScience from '../assets/categories/cat_arts_science.jpg';
import catManagement from '../assets/categories/cat_management.jpg';
import catPharmacy from '../assets/categories/cat_pharmacy.jpg';
import catLaw from '../assets/categories/cat_law.jpg';
import catArchitecture from '../assets/categories/cat_architecture.jpg';
import catPhysicalEducation from '../assets/categories/cat_physical_education.jpg';
import PageTransition from '../components/common/PageTransition';

const SLIDE_CATEGORIES = [
  { name: 'Engineering', image: catEngineering },
  { name: 'Medical (MBBS)', image: catMedical },
  { name: 'Nursing', image: catNursing },
  { name: 'Polytechnic', image: catPolytechnic },
  { name: 'Computer Applications', image: catComputerApplications },
  { name: 'Allied Health Sciences', image: catAlliedHealth },
  { name: 'Physiotherapy', image: catPhysiotherapy },
  { name: 'Occupational Therapy', image: catOccupationalTherapy },
  { name: 'Arts & Science', image: catArtsScience },
  { name: 'Management (MBA/MCA)', image: catManagement },
  { name: 'Pharmacy', image: catPharmacy },
  { name: 'Law (LLB)', image: catLaw },
  { name: 'Architecture', image: catArchitecture },
  { name: 'Physical Education', image: catPhysicalEducation },
];

const SERVICES = [
  { icon: '🎓', title: 'Admission Guidance', desc: 'Expert guidance through the complex admission process for engineering, medical, and allied programs across Tamil Nadu.' },
  { icon: '🎯', title: 'Career Counselling', desc: 'Personalised one-on-one sessions to match your interests and strengths with the right academic path.' },
  { icon: '📚', title: 'Course Selection', desc: 'Choose from a broad spectrum of programs that align with your academic background and career ambitions.' },
  { icon: '💰', title: 'Scholarship Support', desc: 'Assistance in securing merit-based and need-based scholarships ranging from ₹5,000 to ₹25,000.' },
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
  const [collegeStats, setCollegeStats] = useState({ eng: 50, med: 25, arts: 40 });
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const slideTimerRef = useRef(null);
  const isPausedRef = useRef(false);

  const advanceSlide = () => {
    if (isPausedRef.current) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % SLIDE_CATEGORIES.length;
        setNextSlide((next + 1) % SLIDE_CATEGORIES.length);
        return next;
      });
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    slideTimerRef.current = setInterval(advanceSlide, 2800);
    return () => clearInterval(slideTimerRef.current);
  }, []);

  const handlePause = () => {
    isPausedRef.current = true;
    setIsPaused(true);
  };

  const handleResume = () => {
    isPausedRef.current = false;
    setIsPaused(false);
  };

  const goToSlide = (idx) => {
    clearInterval(slideTimerRef.current);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setNextSlide((idx + 1) % SLIDE_CATEGORIES.length);
      setIsTransitioning(false);
    }, 300);
    slideTimerRef.current = setInterval(advanceSlide, 2800);
  };

  // Build upcoming thumbnails: next 4 after current
  const upcomingThumbs = Array.from({ length: 4 }, (_, i) =>
    SLIDE_CATEGORIES[(currentSlide + 1 + i) % SLIDE_CATEGORIES.length]
  ).map((cat, i) => ({
    ...cat,
    idx: (currentSlide + 1 + i) % SLIDE_CATEGORIES.length,
  }));;

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
        const allColleges = Array.isArray(data) ? data : data.results || [];

        let eng = 0, med = 0, arts = 0;
        allColleges.forEach(c => {
          const courses = c.courses_offered || c.courses_offered_display || [];
          const coursesStr = courses.join(' ').toLowerCase();
          if (coursesStr.includes('engineering') || coursesStr.includes('technology')) eng++;
          if (coursesStr.includes('medical') || coursesStr.includes('health') || coursesStr.includes('nursing') || coursesStr.includes('pharmacy')) med++;
          if (coursesStr.includes('arts') || coursesStr.includes('science')) arts++;
        });

        // Only update if we actually got real data to prevent showing 0s on empty API
        if (allColleges.length > 0) {
          setCollegeStats({ eng, med, arts });
        }

        const list = allColleges.slice(0, 6).map(c => ({
          ...c,
          displayImage: c.primary_image_url || c.cover_image || c.college_images?.[0] || c.logo_url || null,
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
          HERO — BENTO GRID
          ══════════════════════════════════════ */}
        <section className="hero-bento-section">
          <div className="hero-bento-wrap">

            {/* ── Left: Category Slideshow ── */}
            <div
              className="hero-slideshow-panel"
              onMouseEnter={handlePause}
              onMouseLeave={handleResume}
            >

              {/* Pause indicator */}
              {isPaused && (
                <div className="slide-pause-badge">
                  <span>⏸</span> PAUSED
                </div>
              )}

              {/* Slide layers */}
              {SLIDE_CATEGORIES.map((cat, idx) => (
                <div
                  key={idx}
                  className={`slide-layer ${idx === currentSlide
                      ? isTransitioning ? 'slide-exit' : 'slide-active'
                      : 'slide-hidden'
                    }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={`slide-image ${idx === currentSlide && !isTransitioning ? 'slide-zoom' : ''
                      }`}
                  />
                  <div className="slide-overlay" />
                </div>
              ))}

              {/* Category Name Badge */}
              <div className={`slide-name-badge ${isTransitioning ? 'slide-name-exit' : 'slide-name-enter'}`}>
                <span className="slide-name-label">CATEGORY</span>
                <strong className="slide-name-text">
                  {SLIDE_CATEGORIES[currentSlide].name}
                </strong>
              </div>

              {/* Upcoming Thumbnails Strip */}
              <div className="slide-thumbs-strip">
                {upcomingThumbs.map((cat, i) => (
                  <button
                    key={i}
                    className={`slide-thumb-item ${i === 0 ? 'slide-thumb-next' : ''}`}
                    onClick={() => goToSlide(cat.idx)}
                    title={cat.name}
                  >
                    <img src={cat.image} alt={cat.name} />
                    <div className="slide-thumb-overlay" />
                    <span className="slide-thumb-name">{cat.name}</span>
                    {i === 0 && <span className="slide-thumb-next-label">NEXT ›</span>}
                  </button>
                ))}
              </div>

              {/* Counter */}
              <div className="slide-counter">
                <span className="slide-counter-cur">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="slide-counter-sep">/</span>
                <span className="slide-counter-total">{String(SLIDE_CATEGORIES.length).padStart(2, '0')}</span>
              </div>

            </div>

            {/* ── Right: Content ── */}
            <div className="hero-bento-content">

              {/* Eyebrow */}
              <div className="bento-eyebrow">
                <span className="bento-eyebrow-dot" />
                Admissions {new Date().getFullYear()}–{new Date().getFullYear() + 1} Open
              </div>

              {/* Headline */}
              <h1 className="hero-bento-title">
                YOUR PATH<br />
                TO A<br />
                <span className="bento-title-accent">DREAM</span><br />
                COLLEGE
              </h1>

              {/* CTA Row */}
              <div className="hero-bento-cta-row">
                <Link to="/apply" className="bento-btn-dark">
                  APPLY NOW
                </Link>
                <Link to="/colleges" className="bento-btn-arrow" aria-label="Explore Colleges">
                  <FaArrowRight size={16} />
                </Link>
                <div className="bento-cta-side-img">
                  <img src={catNursing} alt="" />
                </div>
              </div>

              {/* Numbered Steps */}
              <div className="hero-bento-steps">
                <div className="bento-step-divider" />
                {[
                  { num: '01', text: 'Free counselling & career guidance session', year: '/2025' },
                  { num: '02', text: 'Scholarship mapping & documentation support', year: '/2025' },
                ].map((step, i) => (
                  <div key={i} className="bento-step-row">
                    <span className="bento-step-num">{step.num}</span>
                    <div className="bento-step-thumb">
                      <img src={i === 0 ? catEngineering : catManagement} alt="" />
                    </div>
                    <p className="bento-step-text">{step.text}</p>
                    <span className="bento-step-year">{step.year}</span>
                    <div className="bento-step-divider" />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════
          CATEGORY SCROLL STRIP
          ══════════════════════════════════════ */}
        <section className="cat-scroll-section" aria-label="Course categories">
          {/* Row 1 — scrolls left */}
          <div className="cat-scroll-row">
            {[0, 1].map(dup => (
              <div key={dup} className="cat-scroll-track cat-scroll-left" aria-hidden={dup === 1}>
                {SLIDE_CATEGORIES.map((cat, i) => (
                  <div key={i} className="cat-scroll-card">
                    <img src={cat.image} alt={cat.name} className="cat-scroll-img" />
                    <div className="cat-scroll-overlay" />
                    <span className="cat-scroll-name">{cat.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Row 2 — scrolls right */}
          <div className="cat-scroll-row">
            {[0, 1].map(dup => (
              <div key={dup} className="cat-scroll-track cat-scroll-right" aria-hidden={dup === 1}>
                {[...SLIDE_CATEGORIES].reverse().map((cat, i) => (
                  <div key={i} className="cat-scroll-card">
                    <img src={cat.image} alt={cat.name} className="cat-scroll-img" />
                    <div className="cat-scroll-overlay" />
                    <span className="cat-scroll-name">{cat.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>



        {/* ══════════════════════════════════════
          HOW IT WORKS (SERVICES)
          ══════════════════════════════════════ */}
        <section className="hiw-section">
          <div className="hiw-container">

            <div className="hiw-header">
              <span className="hiw-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                PROCESS
              </span>
              <h2 className="hiw-title">Services We Offer Today</h2>
            </div>

            <div className="hiw-steps-wrapper">
              {/* Wavy dashed line background */}
              <svg className="hiw-dashed-line" preserveAspectRatio="none" viewBox="0 0 1000 100">
                <path d="M 125 50 C 208 0, 291 100, 375 50 C 458 0, 541 100, 625 50 C 708 0, 791 100, 875 50" fill="none" stroke="#cfcfcf" strokeWidth="2" strokeDasharray="6 6" />
              </svg>

              <div className="hiw-steps-grid">
                {SERVICES.map((svc, i) => (
                  <div key={i} className="hiw-step">
                    <div className="hiw-badge">{svc.icon}</div>
                    <h3 className="hiw-step-title">{svc.title}</h3>
                    <p className="hiw-step-desc">{svc.desc}</p>
                  </div>
                ))}
              </div>
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

              {/* College Stats */}
              <div className="partner-stats-row">
                <div className="partner-stat-card">
                  <span className="stat-icon">⚙️</span>
                  <div className="stat-info">
                    <h3 className="stat-num">{collegeStats.eng}+</h3>
                    <p className="stat-label">Engineering Colleges</p>
                  </div>
                </div>
                <div className="partner-stat-card">
                  <span className="stat-icon">⚕️</span>
                  <div className="stat-info">
                    <h3 className="stat-num">{collegeStats.med}+</h3>
                    <p className="stat-label">Medical Colleges</p>
                  </div>
                </div>
                <div className="partner-stat-card">
                  <span className="stat-icon">🎨</span>
                  <div className="stat-info">
                    <h3 className="stat-num">{collegeStats.arts}+</h3>
                    <p className="stat-label">Arts & Science Colleges</p>
                  </div>
                </div>
              </div>

              <div className="colleges-grid">
                {colleges.map(college => (
                  <div key={college.id} className="college-card">
                    <div className="college-card-image">
                      {college.primary_image_url
                        ? <img src={college.primary_image_url} alt={college.college_name || college.name} />
                        : <div className="college-img-placeholder">🏛️</div>
                      }
                      <span className="college-card-badge">
                        {college.accreditation || 'Accredited'}
                      </span>
                    </div>
                    <div className="college-card-body">
                      <h3 className="college-card-name">{college.college_name || college.name}</h3>
                      <p className="college-card-location">
                        <FaMapMarkerAlt size={12} color="#f59e0b" />
                        {college.location_city || college.location || 'Tamil Nadu'}
                      </p>
                      <div className="college-card-actions">
                        <Link to={`/colleges/${college.short_name || college.slug}`} className="btn-view">
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
