import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const SCHOLARSHIPS = [
  {
    icon: '🏆',
    title: 'Merit Scholarship',
    amount: '₹25,000',
    eligibility: 'Students scoring 90%+ in 12th standard',
    details: ['Applicable for Engineering & Medical programs', 'One-time award at the time of admission', 'No repayment required'],
    color: '#e8a020',
  },
  {
    icon: '🎓',
    title: 'Academic Excellence Award',
    amount: '₹15,000',
    eligibility: 'Students scoring 80%–89% in 12th standard',
    details: ['Available across all courses', 'Merit-based selection', 'Awarded at admission time'],
    color: '#7c3aed',
  },
  {
    icon: '💡',
    title: 'NEET / JEE Achiever Grant',
    amount: '₹20,000',
    eligibility: 'Students with NEET / JEE rank under 50,000',
    details: ['For Medical & Engineering aspirants', 'Rank-based slab system', 'Stackable with other scholarships'],
    color: '#5b6af0',
  },
  {
    icon: '🌱',
    title: 'Need-Based Scholarship',
    amount: 'Up to ₹10,000',
    eligibility: 'Students from economically weaker sections',
    details: ['Income certificate required', 'Available for all courses', 'Renewable annually based on performance'],
    color: '#25D366',
  },
  {
    icon: '⚡',
    title: 'Early Bird Offer',
    amount: '₹5,000',
    eligibility: 'Students who complete admission within 7 days of counseling',
    details: ['Limited seats', 'First-come, first-served', 'Available across all colleges'],
    color: '#e84d4d',
  },
  {
    icon: '🏅',
    title: 'Government Category Scholarship',
    amount: 'As per Govt. norms',
    eligibility: 'BC / MBC / SC / ST / Minority category students',
    details: ['Government of Tamil Nadu scheme', 'Full or partial fee waiver possible', 'We assist with application process'],
    color: '#2a9d8f',
  },
];

const PROCESS = [
  { step: '01', title: 'Check Eligibility', desc: 'Contact our counselors and share your academic details to check which scholarships you qualify for.' },
  { step: '02', title: 'Submit Documents', desc: 'Provide marksheets, ID proof, income certificate (if applicable), and entrance score cards.' },
  { step: '03', title: 'Application Review', desc: 'Our team reviews your application and processes it with the respective college or scheme.' },
  { step: '04', title: 'Scholarship Awarded', desc: 'Once approved, the scholarship amount is adjusted in your fee structure at the time of admission.' },
];

export default function Scholarship() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="scholarship-page">
      {/* Hero */}
      <section className="scholarship-hero">
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="scholarship-hero-content">
            <div className="section-label-premium"><span className="label-dot" />Financial Support</div>
            <h1>Scholarships & <span className="title-highlight">Financial Aid</span></h1>
            <p>We believe financial constraints should never stop a deserving student. Explore scholarship opportunities available through Mari Educational Trust.</p>
          </div>
        </div>
      </section>

      {/* Scholarships Grid */}
      <section className="scholarships-grid-section">
        <div className="container">
          <div className="section-header-centered">
            <div className="section-label-premium"><span className="label-dot" />Available Scholarships</div>
            <h2 className="section-title-premium">Financial <span className="title-highlight">Opportunities</span></h2>
            <p className="section-subtitle-premium">Multiple scholarship schemes to support your educational journey</p>
          </div>

          <div className="scholarships-grid">
            {SCHOLARSHIPS.map((s, i) => (
              <div key={i} className="scholarship-card card-3d">
                <div className="sc-icon-wrap" style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
                <div className="sc-amount" style={{ color: s.color }}>{s.amount}</div>
                <h3 className="sc-title">{s.title}</h3>
                <p className="sc-eligibility">✅ {s.eligibility}</p>
                <ul className="sc-details">
                  {s.details.map((d, j) => <li key={j}>{d}</li>)}
                </ul>
                <div className="sc-badge" style={{ background: `${s.color}15`, color: s.color }}>
                  Apply Now
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="scholarship-process-section premium-3d-wrap">
        <div className="container">
          <div className="section-header-centered">
            <div className="section-label-premium"><span className="label-dot" />How to Apply</div>
            <h2 className="section-title-premium">Scholarship <span className="title-highlight">Process</span></h2>
          </div>
          <div className="process-steps">
            <div className="process-line-connector" />
            {PROCESS.map((step, i) => (
              <div key={i} className="process-step-item card-3d">
                <div className="step-number-box"><span className="step-number">{step.step}</span></div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="success-cta-section">
        <div className="success-bg-orb orb-1" />
        <div className="success-bg-orb orb-2" />
        <div className="success-cta-inner">
          <div className="success-cta-header">
            <div className="success-badge"><span className="badge-star">★</span>Free Scholarship Consultation</div>
            <h2 className="success-cta-title">Check Your <span className="success-highlight">Eligibility Today</span></h2>
            <p className="success-cta-sub">Don't miss out on scholarship opportunities. Our counselors will help you identify and apply for all eligible scholarships.</p>
          </div>
          <div className="success-cta-bottom">
            <Link to="/apply" className="success-main-btn">
              <span className="btn-shimmer" />
              Apply Now
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="contact-quick-bar">
              <a href="tel:+919843139330" className="quick-contact-link">📞 9843139330</a>
              <span>|</span>
              <a href="https://wa.me/919941489330" className="quick-contact-link" target="_blank" rel="noreferrer">💬 WhatsApp: 9941489330</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
