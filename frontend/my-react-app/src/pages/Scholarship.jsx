import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchScholarships } from '../services/api';
import PageTransition from '../components/common/PageTransition';

const SCHOLARSHIPS = [
  {
    icon: '🏆',
    title: 'Merit Scholarship',
    amount: '₹25,000',
    eligibility: 'Students scoring 90%+ in 12th standard',
    details: [
      'Applicable for Engineering & Medical programs',
      'One-time award at the time of admission',
      'No repayment required',
    ],
    color: '#f59e0b',
  },
  {
    icon: '🎓',
    title: 'Academic Excellence Award',
    amount: '₹15,000',
    eligibility: 'Students scoring 80%–89% in 12th standard',
    details: [
      'Available across all courses',
      'Merit-based selection',
      'Awarded at admission time',
    ],
    color: '#7c3aed',
  },
  {
    icon: '💡',
    title: 'NEET / JEE Achiever Grant',
    amount: '₹20,000',
    eligibility: 'Students with NEET / JEE rank under 50,000',
    details: [
      'For Medical & Engineering aspirants',
      'Rank-based slab system',
      'Stackable with other scholarships',
    ],
    color: '#2563eb',
  },
  {
    icon: '🌱',
    title: 'Need-Based Scholarship',
    amount: 'Up to ₹10,000',
    eligibility: 'Students from economically weaker sections',
    details: [
      'Income certificate required',
      'Available for all courses',
      'Renewable annually on performance',
    ],
    color: '#16a34a',
  },
  {
    icon: '⚡',
    title: 'Early Bird Offer',
    amount: '₹5,000',
    eligibility: 'Complete admission within 7 days of counselling',
    details: [
      'Limited seats available',
      'First-come, first-served',
      'Available across all colleges',
    ],
    color: '#dc2626',
  },
  {
    icon: '🏅',
    title: 'Govt. Category Scholarship',
    amount: 'As per Govt. norms',
    eligibility: 'BC / MBC / SC / ST / Minority category students',
    details: [
      'Government of Tamil Nadu scheme',
      'Full or partial fee waiver possible',
      'We assist with the application process',
    ],
    color: '#0d9488',
  },
];

const PROCESS = [
  { step: '01', title: 'Check Eligibility', desc: 'Contact our counsellors and share your academic details to find which scholarships you qualify for.' },
  { step: '02', title: 'Submit Documents', desc: 'Provide mark sheets, ID proof, income certificate (if applicable), and entrance score cards.' },
  { step: '03', title: 'Application Review', desc: 'Our team reviews your application and coordinates with the respective college or scheme.' },
  { step: '04', title: 'Scholarship Awarded', desc: 'Once approved, the scholarship amount is directly adjusted in your fee structure at admission.' },
];

export default function Scholarship() {
  const [scholarships, setScholarships] = useState(SCHOLARSHIPS);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const data = await fetchScholarships();
        if (Array.isArray(data) && data.length > 0) {
          setScholarships(data);
        }
      } catch { /* ignore and use fallback */ }
    })();
  }, []);

  return (
    <PageTransition>
      <div className="scholarship-page">

      {/* ── Hero ── */}
      <section className="scholarship-hero">
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="scholarship-hero-content fade-up">
            <div className="section-label-premium">
              <span className="label-dot" /> Financial Support
            </div>
            <h1>
              Scholarships &amp; <span className="title-highlight">Financial Aid</span>
            </h1>
            <p style={{ marginTop: 14, maxWidth: 560, fontSize: '1.05rem', lineHeight: 1.78 }}>
              We believe financial constraints should never stop a deserving student.
              Explore every scholarship opportunity available through Mari Educational Trust.
            </p>
          </div>
        </div>
      </section>


      {/* ── Scholarships Grid ── */}
      <section className="scholarships-grid-section">
        <div className="container">
          <div className="section-header-centered">
            <div className="section-label-premium">
              <span className="label-dot" /> Available Scholarships
            </div>
            <h2 className="section-title-premium">
              Financial <span className="title-highlight">Opportunities</span>
            </h2>
            <p className="section-subtitle-premium">
              Multiple scholarship schemes to support your educational journey.
            </p>
          </div>

          <div className="scholarships-grid">
            {scholarships.map((s, i) => (
              <div key={i} className="scholarship-card">
                <div
                  className="sc-icon-wrap"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
                >
                  {s.icon}
                </div>
                <div className="sc-amount" style={{ color: s.color }}>{s.amount}</div>
                <h3 className="sc-title">{s.title}</h3>
                <p className="sc-eligibility">✅ {s.eligibility}</p>
                <ul className="sc-details">
                  {s.details.map((d, j) => (
                    <li key={j} style={{ '--dot-color': s.color }}>{d}</li>
                  ))}
                </ul>
                <Link
                  to="/apply"
                  className="sc-badge"
                  style={{
                    background: `${s.color}12`,
                    border: `1.5px solid ${s.color}30`,
                    color: s.color,
                    textDecoration: 'none',
                  }}
                >
                  Apply Now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Process ── */}
      <section className="scholarship-process-section">
        <div className="container">
          <div className="section-header-centered">
            <div className="section-label-premium">
              <span className="label-dot" /> How to Apply
            </div>
            <h2 className="section-title-premium">
              Scholarship <span className="title-highlight">Process</span>
            </h2>
            <p className="section-subtitle-premium">
              Four simple steps from eligibility check to scholarship confirmation.
            </p>
          </div>

          <div className="process-steps">
            {PROCESS.map((step, i) => (
              <div key={i} className="process-step-item">
                <div className="step-number-box">
                  <span className="step-number">{step.step}</span>
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


      {/* ── CTA ── */}
      <section className="success-cta-section">
        <div className="success-bg-orb orb-1" />
        <div className="success-bg-orb orb-2" />
        <div className="success-cta-inner">
          <div className="success-cta-header">
            <div className="success-badge">
              <span className="badge-star">★</span> Free Scholarship Consultation
            </div>
            <h2 className="success-cta-title">
              Check Your <span className="success-highlight">Eligibility Today</span>
            </h2>
            <p className="success-cta-sub">
              Don't miss out on financial support. Our counsellors will help you identify
              and apply for every scholarship you qualify for.
            </p>
          </div>

          <div className="success-cta-bottom">
            <Link to="/apply" className="success-main-btn">
              <span className="btn-shimmer" />
              Apply Now
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 17, height: 17 }}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="contact-quick-bar">
              <a href="tel:+919843139330" className="quick-contact-link">📞 9843139330</a>
              <span style={{ color: 'var(--text-faint)' }}>|</span>
              <a href="https://wa.me/919941489330" className="quick-contact-link" target="_blank" rel="noreferrer">
                💬 WhatsApp: 9941489330
              </a>
            </div>
          </div>
        </div>
      </section>

      </div>
    </PageTransition>
  );
}
