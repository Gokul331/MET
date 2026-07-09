import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

// Import local assets
import aboutHeroImg from '../assets/about-hero.jpg';
import missionMainImg from '../assets/mission-main.jpg';
import missionSubImg from '../assets/mission-sub.jpg';
import visionMainImg from '../assets/vision-main.jpg';
import visionSubImg from '../assets/vision-sub.jpg';
import historyMainImg from '../assets/history-main.jpg';
import historySubImg from '../assets/history-sub.jpg';
import processVideoCoverImg from '../assets/process-video-cover.jpg';

const STATS = [
  { value: '5000+', label: 'Students Guided' },
  { value: '20+', label: 'Expert Counselors' },
  { value: '1000+', label: 'Parent Reviews' },
  { value: '12+', label: 'Years Excellence' },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Profile Analysis', desc: 'We assess academic history, strengths, and career aspirations.' },
  { step: '02', title: 'College Matching', desc: 'Match preferences with top-tier accredited engineering/medical colleges.' },
  { step: '03', title: 'Documentation Support', desc: 'Guidance through application filings, waivers, and trust aid requests.' },
  { step: '04', title: 'Direct Seat Allocation', desc: 'Secure seat confirmations and complete logistics smoothly.' },
];

export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [activeVideo, setActiveVideo] = useState(false);

  return (
    <PageTransition>
      <div className="about-page-premium" style={{ background: '#fcfcfc', paddingBottom: '80px' }}>

        {/* ── Section 1: Hero Header ── */}
        <section className="about-hero-premium" style={{ padding: '130px 0 60px', borderBottom: '1px solid var(--border)' }}>
          <div className="hero-bg-pattern" />
          <div className="container">
            <div className="about-hero-grid">
              
              {/* Left Column: Text Content & Actions */}
              <div className="about-hero-grid-left" style={{ textAlign: 'left' }}>
                <div className="section-label-premium" style={{ display: 'inline-flex' }}>
                  <span className="label-dot" /> Mari Educational Trust
                </div>
                <h1 className="section-title-premium" style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.25, margin: '14px 0 20px', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '-0.5px' }}>
                  Your Trusted Guide to<br />
                  <span className="title-highlight">Professional Success</span>
                </h1>
                <p className="section-subtitle-premium" style={{ margin: '0 0 28px', maxWidth: '500px', fontSize: '1rem', lineHeight: 1.68, textAlign: 'left' }}>
                  Helping students secure direct, merit-based, and trust-assisted admissions in reputable engineering and medical programs since 2014.
                </p>
                <div className="hero-btn-group" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <Link to="/apply" className="btn-primary" style={{ padding: '12px 28px' }}>Start Application</Link>
                  <Link to="/colleges" className="btn-outline" style={{ padding: '12px 28px' }}>Explore Colleges</Link>
                </div>
              </div>
              
              {/* Right Column: Hero Image visual with sticker badges */}
              <div style={{ position: 'relative', height: '380px', width: '100%', borderRadius: '24px', zIndex: 2 }}>
                {/* Floating badge sticker overlapping the top corner */}
                <div className="about-badge-sticker" style={{ top: '-12px', right: '20px' }}>
                  <span>⭐ Govt. Registered</span>
                  <span>MSME Certified</span>
                </div>
                {/* Image panel */}
                <div style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}>
                  <img
                    src={aboutHeroImg}
                    alt="Mari Educational Trust Team"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Section 2: Core Statement Block ── */}
        <section style={{ padding: '60px 0' }}>
          <div className="container">
            <h2 className="about-typography-statement">
              We believe in <strong>innovative, transparent, and direct admission counseling</strong>, leveraging our <strong>deep institutional networks</strong> and <strong>expert counseling advisors</strong> to guide every aspiring student toward their dream college path.
            </h2>
            
            {/* 4-Column Statistics Grid */}
            <div className="about-stats-grid">
              {STATS.map((stat, i) => (
                <div key={i} className="about-stat-card card-3d">
                  <div className="about-stat-number">{stat.value}</div>
                  <div className="about-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: Our Mission (Overlapping Left Visual) ── */}
        <section style={{ padding: '60px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px', alignItems: 'center' }}>
              {/* Left: Overlapping collage wrapper */}
              <div className="about-collage-container">
                <img
                  className="about-collage-img-main"
                  src={missionMainImg}
                  alt="Students counseling session"
                />
                <img
                  className="about-collage-img-sub"
                  src={missionSubImg}
                  alt="Team discussion"
                />
              </div>

              {/* Right: Mission content block */}
              <div>
                <div className="section-label-premium" style={{ display: 'inline-flex' }}>
                  <span className="label-dot" /> Foundation Goal
                </div>
                <h2 className="section-title-premium" style={{ margin: '8px 0 16px', textAlign: 'left' }}>
                  Our <span className="title-highlight">Mission</span>
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.68, marginBottom: '24px' }}>
                  To bridge the gap between academic dreams and career landmarks. We strive to offer accessible guidance, assist families in selecting verified courses, and clear the complexity out of admission procedures.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    'Fostering Academic & Professional Growth',
                    'Individual Career Profiling & Guidance',
                    'Institutional Collaborative Linkages',
                    'Promoting Global Standards in Regional Admissions'
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      <span style={{ color: '#16a34a', fontSize: '1.1rem' }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: Our Vision (Overlapping Right Visual) ── */}
        <section style={{ padding: '60px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '64px', alignItems: 'center' }}>
              {/* Left: Vision content block */}
              <div>
                <div className="section-label-premium" style={{ display: 'inline-flex' }}>
                  <span className="label-dot" /> Future Vision
                </div>
                <h2 className="section-title-premium" style={{ margin: '8px 0 16px', textAlign: 'left' }}>
                  Our <span className="title-highlight">Vision</span>
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.68, marginBottom: '24px' }}>
                  Creating a future-ready community of innovators, doctors, and engineers. We envision an educational space in Tamil Nadu where seat allocations are transparent and every eligible child receives merit scholarships.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    'Cultivating Future-Ready Innovators',
                    'Democratizing Seat Allocation Standards',
                    'Merit-Based Scholarship & Financial Aid Support',
                    'Sustaining Lifetime Institutional Partnerships'
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      <span style={{ color: 'var(--blue)', fontSize: '1.1rem' }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Overlapping collage wrapper */}
              <div className="about-collage-container">
                <img
                  className="about-collage-img-main"
                  src={visionMainImg}
                  alt="Student campus presentation"
                />
                <img
                  className="about-collage-img-sub"
                  src={visionSubImg}
                  alt="Campus research laboratory"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: Our History (Overlapping Left Visual) ── */}
        <section style={{ padding: '60px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px', alignItems: 'center' }}>
              {/* Left: Overlapping collage wrapper */}
              <div className="about-collage-container">
                <img
                  className="about-collage-img-main"
                  src={historyMainImg}
                  alt="University main gate"
                />
                <img
                  className="about-collage-img-sub"
                  src={historySubImg}
                  alt="Graduation event ceremony"
                />
              </div>

              {/* Right: History content block */}
              <div>
                <div className="section-label-premium" style={{ display: 'inline-flex' }}>
                  <span className="label-dot" /> Historical Milestones
                </div>
                <h2 className="section-title-premium" style={{ margin: '8px 0 16px', textAlign: 'left' }}>
                  Our <span className="title-highlight">History</span>
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.68, marginBottom: '24px' }}>
                  Mari Educational Trust was initialized to provide fair educational resources. Since our inception, we have grown to partner with over 15+ branch colleges and help thousands of students build careers.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    'Humble Beginnings as Local Advisory (2014)',
                    'Formally Registered MSME Trust (2024)',
                    'Broadened Regional Liaison Across Tamil Nadu',
                    'State-of-the-Art Digital Admissions Support Desk'
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      <span style={{ color: '#f59e0b', fontSize: '1.1rem' }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 6: How We Guide You (Video Play Section) ── */}
        <section style={{ padding: '60px 0 20px' }}>
          <div className="container">
            <div className="section-header-centered" style={{ marginBottom: '40px' }}>
              <div className="section-label-premium" style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <span className="label-dot" /> Operation Process
              </div>
              <h2 className="section-title-premium" style={{ margin: '8px 0 0' }}>
                How We <span className="title-highlight">Do Work</span>
              </h2>
              <p className="section-subtitle-premium" style={{ margin: '12px auto 0', maxWidth: '500px' }}>
                A step-by-step transparent pathway to analyze profiles and secure your ideal seat.
              </p>
            </div>

            {/* Video Placeholder Box */}
            <div style={{ position: 'relative', height: '360px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', marginBottom: '40px' }}>
              <img
                src={processVideoCoverImg}
                alt="Workspace laptop"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
              />
              
              {/* Play overlay button */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.button 
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveVideo(true)}
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(245,158,11,0.4)',
                    paddingLeft: '6px'
                  }}
                >
                  ▶
                </motion.button>
              </div>
            </div>

            {/* Video active state popup */}
            <AnimatePresence>
              {activeVideo && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveVideo(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15,23,42,0.85)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                  }}
                >
                  <motion.div 
                    initial={{ scale: 0.95, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 15 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: 'var(--white)',
                      borderRadius: 'var(--r-xl)',
                      padding: '36px',
                      maxWidth: '500px',
                      width: '100%',
                      boxShadow: 'var(--shadow-2xl)',
                      textAlign: 'center',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '14px' }}>🎓</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Guiding Your Admission Journey</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '12px 0 24px' }}>
                      At Mari Educational Trust, we hold one-on-one counseling, detail the fee breakups, structure application forms, and complete admissions without complications. Give us a call or apply directly online!
                    </p>
                    <button className="btn-primary" style={{ width: '100%' }} onClick={() => setActiveVideo(false)}>
                      Got It, Thanks!
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Process items layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              {PROCESS_STEPS.map((p, i) => (
                <div key={i} className="card-3d" style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--blue)', marginBottom: '8px' }}>
                    STEP {p.step}
                  </div>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {p.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

      </div>
    </PageTransition>
  );
}
