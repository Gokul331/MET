import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchColleges } from '../services/api';
import { FaGraduationCap, FaAward, FaUserCheck, FaChevronRight, FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import bgImg from '../assets/BG.png';

const SERVICES = [
  { icon: '🎓', title: 'Admission Guidance', desc: 'Expert guidance to navigate the complex admission process of our branch colleges and universities across Tamil Nadu.' },
  { icon: '🎯', title: 'Career Counseling', desc: 'Personalized counseling sessions to align your interests and strengths with the right career path.' },
  { icon: '📚', title: 'Course Selection', desc: 'Helping you choose from a wide range of courses that best suit your academic background and goals.' },
  { icon: '💰', title: 'Scholarship Support', desc: 'Information and assistance for securing various merit-based and need-based scholarships from 5k to 25k.' },
  { icon: '📝', title: 'Documentation & Assistance', desc: 'Complete support for application forms, documentation, and admission logs for a smooth process.' },
];

const PROCESS_STEPS = [
  { number: '01', title: 'Initial Consultation', desc: 'Discuss your goals, interests, and academic background with our expert counselors.' },
  { number: '02', title: 'Profile Analysis', desc: 'Comprehensive evaluation of your scores and profile to match with top colleges.' },
  { number: '03', title: 'Documentation Support', desc: 'Complete assistance in preparing and submitting application forms with precision.' },
  { number: '04', title: 'Admission Confirmed', desc: 'Get your admit confirmation and secure your seat in your chosen branch.' },
];

const MARQUEE_ITEMS = ['Engineering', 'Medical (MBBS)', 'Nursing', 'Allied Health Sciences', 'Arts & Science', 'Polytechnic', 'Law', 'Architecture', 'MBA', 'Pharmacy'];

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (location.state?.success) {
      setToast({ show: true, message: location.state.message || 'Application submitted successfully!', type: 'success' });
    } else if (location.state?.error) {
      setToast({ show: true, message: location.state.message || 'An error occurred. Please try again.', type: 'error' });
    }
  }, [location.state]);

  // Show Popup after 1000ms
  useEffect(() => {
    const t = setTimeout(() => setShowPopup(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch colleges
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchColleges();
        const list = (Array.isArray(data) ? data : data.results || []).slice(0, 6).map((c) => ({
          ...c,
          displayImage: c.cover_image || c.college_images?.[0] || c.logo_url || null,
        }));
        setColleges(list);
      } catch (err) {
        console.error('Error fetching colleges:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-split-new">
        <div className="hero-background" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div className="hero-bg-image-wrapper" style={{ position: 'absolute', inset: 0 }}>
            <img src={bgImg} alt="Hero Background" className="hero-full-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="hero-bg-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.15) 100%)' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          <div className="hero-split-wrap">
            
            {/* Left Column */}
            <div className="hero-split-left-new" style={{ animation: 'fadeInUp 0.8s ease' }}>
              <div className="hero-badge floating-3d" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(11,79,145,0.08)', border: '1px solid rgba(11,79,145,0.2)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--blue-primary)', marginBottom: '20px' }}>
                <span className="badge-pulse" style={{ width: '8px', height: '8px', background: 'var(--blue-primary)', borderRadius: '50%', display: 'inline-block' }} />
                Admissions {new Date().getFullYear()} - {new Date().getFullYear() + 1} Are Open
              </div>
              <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.02em' }}>
                <span style={{ color: 'var(--text-primary)', display: 'block' }}>Bridge the Gap to Your</span>
                <span style={{ background: 'linear-gradient(135deg, #0b4f91, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>Dream College Journey</span>
              </h1>
              <p className="hero-desc" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '36px', maxWidth: '580px', lineHeight: 1.7 }}>
                Mari Educational Trust provides personalized guidance, scholarship assistance, and reliable college admissions support. Empowering students across Tamil Nadu to achieve their professional goals.
              </p>
              
              <div className="hero-buttons">
                <Link to="/apply" className="btn-dark" style={{ background: 'linear-gradient(135deg, var(--blue-primary), var(--blue-dark))', boxShadow: '0 4px 20px rgba(11,79,145,0.25)', padding: '14px 32px', fontSize: '0.95rem' }}>
                  Apply for Admission <FaChevronRight size={12} style={{ marginLeft: '4px' }} />
                </Link>
                <Link to="/colleges" className="btn-outline" style={{ padding: '13px 30px', fontSize: '0.95rem', border: '1px solid rgba(11,79,145,0.25)', color: 'var(--blue-primary)' }}>
                  Explore Branches
                </Link>
              </div>

              <div className="hero-trust">
                {[
                  { value: 'Govt.', label: 'Registered MSME' },
                  { value: '5k - 25k', label: 'Scholarship Support' },
                  { value: '100%', label: 'Dedicated Guidance' }
                ].map((item, idx) => (
                  <div key={idx} className="trust-item" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="trust-num" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--blue-primary)' }}>{item.value}</span>
                    <span className="trust-label" style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="hero-split-right-new" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div className="hero-premium-glass-card" style={{ background: '#ffffff', border: '1px solid rgba(11,79,145,0.1)', borderRadius: '24px', padding: '32px', boxShadow: '0 15px 40px rgba(11,79,145,0.06)', width: '100%', maxWidth: '380px', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(11,79,145,0.06) 0%, transparent 70%)', top: '-20px', right: '-20px', pointerEvents: 'none' }} />
                
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--gold)' }}>★</span> Active Notifications
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { icon: <FaGraduationCap color="var(--blue-primary)" size={18} />, title: 'Engineering Admissions', desc: 'B.E / B.Tech counseling support is active.' },
                    { icon: <FaAward color="var(--gold)" size={18} />, title: 'Scholarship Registration', desc: 'Secure merit-based scholarship slots now.' },
                    { icon: <FaUserCheck color="#10b981" size={18} />, title: 'Medical Placements', desc: 'Assistance for MBBS & Allied Health programs.' }
                  ].map((note, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', background: 'rgba(11,79,145,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(11,79,145,0.05)' }}>
                      <div style={{ background: 'rgba(11,79,145,0.05)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {note.icon}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{note.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{note.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <Link to="/apply" style={{ display: 'block', padding: '12px', background: 'rgba(11,79,145,0.04)', border: '1px solid rgba(11,79,145,0.12)', borderRadius: '12px', color: 'var(--blue-primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }} className="glass-btn-hover">
                    Fill Direct Application
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="marquee-section" style={{ background: 'rgba(11, 79, 145, 0.04)', borderTop: '1px solid rgba(11, 79, 145, 0.1)', borderBottom: '1px solid rgba(11, 79, 145, 0.1)' }}>
        <div className="marquee-wrapper">
          {[0, 1].map((key) => (
            <div key={key} className="marquee-track" aria-hidden={key === 1}>
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={i} className="marquee-item" style={{ color: 'var(--text-primary)' }}>
                  <span className="marquee-dot" style={{ color: 'var(--blue-primary)', marginRight: '8px' }}>◆</span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section premium-3d-wrap">
        <div className="services-container">
          <div className="section-header-centered">
            <div className="section-label-premium" style={{ background: 'rgba(11,79,145,0.08)', border: '1px solid rgba(11,79,145,0.2)', color: 'var(--blue-primary)' }}>
              <span className="label-dot" style={{ background: 'var(--blue-light)' }} />Our Expertise
            </div>
            <h2 className="section-title-premium">Services We <span className="title-highlight">Offer</span></h2>
            <p className="section-subtitle-premium">Providing end-to-end guidance and admission strategies to ensure your university journey starts off successfully.</p>
          </div>
          
          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {SERVICES.map((svc, i) => (
              <div key={i} className="service-card card-3d" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '36px 24px' }}>
                <div className="service-icon-wrapper" style={{ marginBottom: '20px' }}>
                  <div className="service-icon-bg" style={{ background: 'rgba(11,79,145,0.06)', width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto' }} />
                  <span className="service-icon" style={{ fontSize: '2.2rem', marginTop: '-48px', display: 'block' }}>{svc.icon}</span>
                </div>
                <h3 className="service-card-title" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>{svc.title}</h3>
                <p className="service-card-desc" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{svc.desc}</p>
                <div className="service-card-line" style={{ background: 'linear-gradient(90deg, transparent, var(--blue-primary), transparent)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section premium-3d-wrap" style={{ background: '#f1f5f9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="process-container">
          <div className="section-header-centered">
            <div className="section-label-premium" style={{ background: 'rgba(11,79,145,0.08)', border: '1px solid rgba(11,79,145,0.2)', color: 'var(--blue-primary)' }}>
              <span className="label-dot" style={{ background: 'var(--blue-light)' }} />Workflow
            </div>
            <h2 className="section-title-premium">Our Guided <span className="title-highlight">Process</span></h2>
          </div>
          
          <div className="process-steps">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="process-step-item card-3d" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div className="step-number-box" style={{ background: 'linear-gradient(135deg, var(--blue-primary), var(--blue-dark))' }}>
                  <span className="step-number">{step.number}</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{step.title}</h3>
                  <p className="step-desc" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Branches / Colleges Preview */}
      {!loading && colleges.length > 0 && (
        <section className="colleges-grid-section" style={{ padding: '80px 0' }}>
          <div className="container">
            <div className="section-header-flex" style={{ marginBottom: '40px' }}>
              <div>
                <h2 className="section-title-premium" style={{ margin: 0 }}>Explore Partner <span className="title-highlight">Colleges</span></h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.92rem' }}>A preview of premium institutions we guide students into.</p>
              </div>
              <Link to="/colleges" className="see-all-link" style={{ color: 'var(--blue-primary)' }}>
                View All Colleges →
              </Link>
            </div>
            
            <div className="colleges-grid">
              {colleges.map((college) => (
                <div key={college.id} className="college-card card-3d" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <div className="college-card-image" style={{ height: '180px' }}>
                    {college.displayImage ? (
                      <img src={college.displayImage} alt={college.name} />
                    ) : (
                      <div className="college-img-placeholder" style={{ background: 'rgba(11,79,145,0.06)', color: 'var(--blue-primary)' }}>🏛️</div>
                    )}
                    <span className="college-card-badge" style={{ borderColor: 'rgba(11,79,145,0.15)', color: 'var(--blue-primary)' }}>
                      {college.accreditation || 'Accredited'}
                    </span>
                  </div>
                  <div className="college-card-body">
                    <h3 className="college-card-name" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{college.name}</h3>
                    <p className="college-card-location" style={{ fontSize: '0.82rem' }}>
                      <FaMapMarkerAlt size={12} color="var(--gold)" /> {college.location || 'Tamil Nadu'}
                    </p>
                    <div className="college-card-actions" style={{ marginTop: '16px' }}>
                      <Link to={`/colleges/${college.slug}`} className="btn-view" style={{ flex: 1, textAlign: 'center', borderColor: 'rgba(11,79,145,0.2)', color: 'var(--blue-primary)', background: 'rgba(11,79,145,0.04)' }}>
                        View Details
                      </Link>
                      <Link to={`/apply?college=${college.id}`} className="btn-dark btn-sm" style={{ background: 'linear-gradient(135deg, var(--blue-primary), var(--blue-dark))', border: 'none', color: '#fff' }}>
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

      {/* Success CTA Section */}
      <section className="success-cta-section" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(11,79,145,0.06) 0%, transparent 75%), #f8fafc' }}>
        <div className="success-bg-orb orb-1" style={{ background: 'rgba(11,79,145,0.03)' }} />
        <div className="success-bg-orb orb-2" style={{ background: 'rgba(56,189,248,0.02)' }} />
        
        <div className="success-cta-inner">
          <div className="success-cta-header">
            <div className="success-badge" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: 'var(--gold)' }}>
              <span className="badge-star">★</span> Registered Education Consultant
            </div>
            <h2 className="success-cta-title" style={{ color: 'var(--text-primary)' }}>Start Your <span className="success-highlight" style={{ background: 'linear-gradient(135deg, var(--blue-primary), var(--blue-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Success Story</span> Today</h2>
            <p className="success-cta-sub" style={{ color: 'var(--text-muted)' }}>
              Get verified counseling and application assistance from <strong>Mari Educational Trust</strong>. We make admissions simple and secure.
            </p>
          </div>

          <div className="success-contact-grid">
            {[
              { icon: <FaPhoneAlt />, label: 'Call Support', val: '9843139330', sub: '9:00 AM - 6:30 PM', color: 'var(--blue-primary)', action: 'tel:+919843139330', actionLabel: 'Call Now' },
              { icon: <FaWhatsapp />, label: 'WhatsApp Us', val: '9941489330', sub: 'Instant documents sharing', color: '#10b981', action: 'https://wa.me/919941489330', actionLabel: 'Open Chat' },
              { icon: <FaMapMarkerAlt />, label: 'Visit Office', val: 'Perambalur, TN', sub: '7/273, Malayadivaram', color: 'var(--gold)', action: '/contact', actionLabel: 'View Map', internal: true }
            ].map((card, i) => (
              <div key={i} className="success-contact-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div className="contact-card-glow" style={{ background: card.color }} />
                <div className="contact-card-icon" style={{ background: `${card.color}10`, color: card.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px' }}>{card.icon}</div>
                <div className="contact-card-label" style={{ marginTop: '12px', color: 'var(--text-muted)' }}>{card.label}</div>
                <div className="contact-card-line" style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>{card.val}</div>
                <p className="contact-card-sub" style={{ fontSize: '0.8rem', margin: '4px 0 16px 0', color: 'var(--text-dim)' }}>{card.sub}</p>
                {card.internal ? (
                  <Link to={card.action} className="contact-card-btn" style={{ background: card.color }}>{card.actionLabel}</Link>
                ) : (
                  <a href={card.action} className="contact-card-btn" target="_blank" rel="noreferrer" style={{ background: card.color }}>{card.actionLabel}</a>
                )}
              </div>
            ))}
          </div>

          <div className="success-cta-bottom" style={{ marginBottom: '0' }}>
            <Link to="/apply" className="success-main-btn" style={{ background: 'linear-gradient(135deg, var(--blue-primary), var(--blue-dark))', boxShadow: '0 6px 24px rgba(11,79,145,0.2)' }}>
              <span className="btn-shimmer" />
              Get Free Consultation
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px', marginLeft: '6px' }}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <p className="success-cta-fine" style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              No registration charges for counseling · Official Partner for Top Academic Branches
            </p>
          </div>
        </div>
      </section>

      {/* Announcement Modal Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', border: '1px solid rgba(11,79,145,0.15)', padding: '36px 28px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', maxWidth: '440px' }}>
            <button className="popup-close" onClick={() => setShowPopup(false)} style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }}>✕</button>
            
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🌟</div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Mari Educational Trust</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Welcome to our portal! We provide complete admission counseling, course selections, and active scholarship mappings for the upcoming academic session.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/apply" onClick={() => setShowPopup(false)} className="btn-dark" style={{ background: 'linear-gradient(135deg, var(--blue-primary), var(--blue-dark))', display: 'block', textAlign: 'center', padding: '12px' }}>
                Register for Admission support
              </Link>
              <button onClick={() => setShowPopup(false)} style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--text-muted)', borderRadius: '50px', padding: '10px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                Explore Site First
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top */}
      {showScrollTop && (
        <button className="scroll-to-top show" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'var(--blue-primary)', boxShadow: '0 4px 16px rgba(11,79,145,0.3)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Toast state notifications */}
      {toast.show && (
        <div className={`toast toast--${toast.type}`} style={{ background: '#ffffff', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
          {toast.message}
          <button onClick={() => setToast({ show: false, message: '', type: '' })} style={{ color: 'var(--text-muted)', marginLeft: '12px' }}>✕</button>
        </div>
      )}
    </div>
  );
}
