import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyApplications, fetchColleges } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

const MotionLink = motion(Link);

export default function Dashboard() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [applications, setApplications] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  // College Matcher Widget State
  const [matcherStep, setMatcherStep] = useState(1);
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [apps, cols] = await Promise.allSettled([
          fetchMyApplications(),
          fetchColleges(),
        ]);
        if (apps.status === 'fulfilled') {
          const d = apps.value;
          setApplications(Array.isArray(d) ? d : d.results || []);
        }
        if (cols.status === 'fulfilled') {
          const d = cols.value;
          setColleges(Array.isArray(d) ? d : d.results || []);
        }
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectStream = (stream) => {
    setSelectedStream(stream);
    setMatcherStep(2);
  };

  const handleSelectPriority = (priority) => {
    setSelectedPriority(priority);
    
    // Filter logic
    let matches = colleges.filter(col => {
      const colName = (col.college_name || col.name || '').toLowerCase();
      const matchStream = colName.includes(selectedStream.toLowerCase()) || 
                          (col.courses_offered && col.courses_offered.some(c => 
                            (typeof c === 'string' && c.toLowerCase().includes(selectedStream.toLowerCase())) ||
                            (c.course_name && c.course_name.toLowerCase().includes(selectedStream.toLowerCase()))
                          ));
      return matchStream || selectedStream === 'Any';
    });

    if (matches.length === 0) {
      matches = colleges.slice(0, 3);
    }

    if (priority === 'Fees') {
      matches = matches.filter(col => (col.college_type || '').toLowerCase().includes('aided') || (col.college_type || '').toLowerCase().includes('government') || true);
    }

    setSuggestions(matches.slice(0, 3));
    setMatcherStep(3);
  };

  const handleResetMatcher = () => {
    setMatcherStep(1);
    setSelectedStream('');
    setSelectedPriority('');
    setSuggestions([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const stats = [
    { icon: '📋', label: 'My Applications', value: applications.length, link: '/applications' },
    { icon: '🏛️', label: 'Partner Colleges', value: colleges.length > 0 ? colleges.length : '12+', link: '/colleges' },
    { icon: '🎓', label: 'Courses Available', value: '18+', link: '/courses' },
    { icon: '💰', label: 'Max Scholarship', value: '₹25K', link: '/scholarship' },
  ];

  const recentApps = applications.slice(0, 3);

  return (
    <PageTransition>
      <div className="dashboard-page">
      {/* Hero */}
      <section className="dashboard-hero">
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="dashboard-hero-content">
            <div className="section-label-premium"><span className="label-dot" />My Dashboard</div>
            <h1>Welcome to <span className="title-highlight">MET Portal</span></h1>
            <p>Manage your applications, explore colleges, and track your admission journey.</p>
          </div>
        </div>
      </section>

      {/* Active Application Tracker Timeline */}
      {recentApps.length > 0 && (
        <section className="dashboard-timeline-section" style={{ padding: '0 0 40px' }}>
          <div className="container">
            <div style={{
              background: 'var(--bg-soft)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎯</span> Active Application Progress: <span style={{ color: 'var(--blue)' }}>#{recentApps[0].id || recentApps[0].application_id}</span>
              </h3>
              
              {/* Stepper progress */}
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '30px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                {/* Background connector line */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '30px',
                  right: '30px',
                  height: '3px',
                  background: 'var(--gray-200)',
                  zIndex: 1
                }} />
                
                {/* Active connector line */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '30px',
                  right: '30px',
                  width: recentApps[0].status === 'approved' || recentApps[0].status === 'rejected' ? '100%' : recentApps[0].status === 'under_review' ? '50%' : '0%',
                  height: '3px',
                  background: recentApps[0].status === 'rejected' ? 'var(--red)' : 'var(--blue)',
                  zIndex: 2,
                  transition: 'width 0.5s ease-in-out'
                }} />

                {/* Steps */}
                {[
                  { label: 'Submitted', desc: 'Application Received', active: true, done: true },
                  { label: 'Under Review', desc: 'Verifying Profile', active: recentApps[0].status === 'under_review' || recentApps[0].status === 'approved' || recentApps[0].status === 'rejected', done: recentApps[0].status === 'approved' || recentApps[0].status === 'rejected' },
                  { 
                    label: recentApps[0].status === 'rejected' ? 'Rejected' : recentApps[0].status === 'approved' ? 'Approved' : 'Admission Offer', 
                    desc: recentApps[0].status === 'rejected' ? 'Seat Unavailable' : recentApps[0].status === 'approved' ? 'Scholarship Confirmed' : 'Awaiting Review', 
                    active: recentApps[0].status === 'approved' || recentApps[0].status === 'rejected', 
                    done: recentApps[0].status === 'approved' || recentApps[0].status === 'rejected',
                    error: recentApps[0].status === 'rejected'
                  }
                ].map((step, idx) => {
                  const circleColor = step.error ? 'var(--red)' : step.done ? 'var(--blue)' : step.active ? 'var(--blue-light)' : 'var(--gray-300)';
                  const textColor = step.active ? 'var(--text-primary)' : 'var(--text-muted)';
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative', width: '120px', textAlign: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--bg-soft)',
                        border: `3px solid ${circleColor}`,
                        color: step.error ? 'var(--red)' : step.active ? 'var(--blue)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        boxShadow: step.active ? 'var(--shadow-sm)' : 'none'
                      }}>
                        {step.error ? '✕' : step.done ? '✓' : idx + 1}
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '0.82rem', fontWeight: 700, color: textColor }}>{step.label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.2 }}>{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="dashboard-stats-section">
        <div className="container">
          <motion.div 
            className="dashboard-stats-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {stats.map((stat, i) => (
              <MotionLink 
                key={i} 
                to={stat.link} 
                className="dashboard-stat-card card-3d"
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02, boxShadow: 'var(--shadow-md)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{loading ? '...' : stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </MotionLink>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Smart College Finder Assistant */}
      <section className="dashboard-matcher-section" style={{ padding: '40px 0 20px' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(37, 99, 235, 0.06) 100%)',
            border: '1.5px dashed var(--border-blue)',
            borderRadius: 'var(--r-xl)',
            padding: '30px 24px',
            boxShadow: 'var(--shadow-xs)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Header info */}
            <div style={{ marginBottom: '24px' }}>
              <div className="section-label-premium" style={{ background: 'var(--white)', border: '1px solid var(--border-blue)', color: 'var(--blue)' }}>
                <span className="label-dot" style={{ background: 'var(--blue)' }} /> Smart Assistant
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
                Find Your Perfect College Match
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                Answer two quick questions to see recommendations from our partner network.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {matcherStep === 1 && (
                <motion.div
                  key="matcher-step-1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <p style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '14px', color: 'var(--text-primary)' }}>
                    Step 1: Select your preferred stream:
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'Engineering', icon: '⚙️', label: 'Engineering & Technology' },
                      { id: 'Medical', icon: '🩺', label: 'Medical / MBBS' },
                      { id: 'Arts', icon: '📖', label: 'Arts & Science' },
                      { id: 'Nursing', icon: '💉', label: 'Nursing' },
                      { id: 'Any', icon: '🎓', label: 'Browse All' }
                    ].map(stream => (
                      <button
                        key={stream.id}
                        onClick={() => handleSelectStream(stream.id)}
                        className="btn-secondary btn-sm card-3d"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 18px',
                          fontSize: '0.86rem',
                          background: 'var(--white)'
                        }}
                      >
                        <span>{stream.icon}</span> {stream.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {matcherStep === 2 && (
                <motion.div
                  key="matcher-step-2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <p style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Selected Stream: <span style={{ color: 'var(--blue)' }}>{selectedStream}</span>
                  </p>
                  <p style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '14px', color: 'var(--text-primary)' }}>
                    Step 2: What is your primary filter?
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                      { id: 'Placement', icon: '🏆', label: 'Top Placement / Rating' },
                      { id: 'Fees', icon: '💰', label: 'Budget Aided / Government' },
                      { id: 'Any', icon: '⭐', label: 'No Preference' }
                    ].map(priority => (
                      <button
                        key={priority.id}
                        onClick={() => handleSelectPriority(priority.id)}
                        className="btn-secondary btn-sm card-3d"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 18px',
                          fontSize: '0.86rem',
                          background: 'var(--white)'
                        }}
                      >
                        <span>{priority.icon}</span> {priority.label}
                      </button>
                    ))}
                    <button
                      onClick={handleResetMatcher}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        textDecoration: 'underline',
                        marginLeft: '8px'
                      }}
                    >
                      ← Back
                    </button>
                  </div>
                </motion.div>
              )}

              {matcherStep === 3 && (
                <motion.div
                  key="matcher-step-3"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', margin: 0 }}>
                      Matched Colleges for <span style={{ color: 'var(--blue)' }}>{selectedStream}</span> ({selectedPriority}):
                    </p>
                    <button
                      onClick={handleResetMatcher}
                      className="btn-outline"
                      style={{
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        background: 'var(--white)'
                      }}
                    >
                      ↺ Find Again
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px'
                  }}>
                    {suggestions.map((col, idx) => {
                      const id = col.college_id || col.id;
                      const slug = col.short_name || id;
                      return (
                        <div key={id || idx} className="card-3d" style={{
                          background: 'var(--white)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--r-md)',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: 'var(--shadow-xs)'
                        }}>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {col.college_name || col.name}
                          </h4>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '12px' }}>
                            📍 {col.location_city || 'Tamil Nadu'}
                          </p>
                          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                            <Link
                              to={`/colleges/${slug}`}
                              className="btn-outline btn-sm"
                              style={{
                                flex: 1,
                                fontSize: '0.76rem',
                                padding: '6px 0',
                                textAlign: 'center',
                                background: 'var(--white)',
                                border: '1px solid var(--border)',
                                display: 'block'
                              }}
                            >
                              Details
                            </Link>
                            <Link
                              to="/apply"
                              state={{ college: col }}
                              className="btn-primary btn-sm"
                              style={{
                                flex: 1.2,
                                fontSize: '0.76rem',
                                padding: '6px 0',
                                textAlign: 'center',
                                justifyContent: 'center',
                                display: 'flex'
                              }}
                            >
                              Apply
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-actions-section">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-title-premium">Quick <span className="title-highlight">Actions</span></h2>
          </div>
          <motion.div 
            className="quick-actions-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {[
              { to: '/apply', icon: '📝', title: 'New Application', desc: 'Start a new college admission application' },
              { to: '/colleges', icon: '🏛️', title: 'Browse Colleges', desc: 'Explore our network of partner colleges' },
              { to: '/scholarship', icon: '💰', title: 'Scholarships', desc: 'Check scholarship eligibility and apply' },
              { to: '/contact', icon: '📞', title: 'Get Counseling', desc: 'Talk to our expert admission counselors' }
            ].map((action, i) => (
              <MotionLink 
                key={i} 
                to={action.to} 
                className="quick-action-card card-3d"
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02, boxShadow: 'var(--shadow-md)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="qa-icon">{action.icon}</div>
                <h3>{action.title}</h3>
                <p>{action.desc}</p>
                <span className="qa-arrow">→</span>
              </MotionLink>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Applications */}
      {recentApps.length > 0 && (
        <section className="dashboard-recent-section">
          <div className="container">
            <div className="section-header-flex">
              <h2 className="section-title-premium">Recent <span className="title-highlight">Applications</span></h2>
              <Link to="/applications" className="see-all-link">View All →</Link>
            </div>
            <div className="applications-list">
              {recentApps.map((app, i) => {
                const id = app.id || app.application_id;
                const status = app.status || 'submitted';
                const STATUS_COLORS = { pending: '#DAA520', approved: '#25D366', rejected: '#E53E3E', under_review: '#a78bfa', submitted: '#8B5CF6' };
                const color = STATUS_COLORS[status] || '#666';
                return (
                  <motion.div 
                    key={id || i} 
                    className="application-card card-3d"
                    whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="app-card-header">
                      <div className="app-card-info">
                        <div className="app-card-id">Application #{id || i + 1}</div>
                        <h3 className="app-card-name">{app.full_name || app.student_name || 'Applicant'}</h3>
                        {app.college_name && <div className="app-card-college">🏛️ {app.college_name}</div>}
                      </div>
                      <div className="app-status-badge" style={{ background: `${color}15`, color, border: `1px solid ${color}40` }}>
                        {status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    <div className="app-card-actions">
                      <Link to={`/applications/${id}`} className="btn-view">View Details</Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      </div>
    </PageTransition>
  );
}
