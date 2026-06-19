import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyApplications, fetchColleges } from '../services/api';

export default function Dashboard() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [applications, setApplications] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setColleges((Array.isArray(d) ? d : d.results || []).slice(0, 6));
        }
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    { icon: '📋', label: 'My Applications', value: applications.length, link: '/applications' },
    { icon: '🏛️', label: 'Partner Colleges', value: colleges.length + '+', link: '/colleges' },
    { icon: '🎓', label: 'Courses Available', value: '10+', link: '/courses' },
    { icon: '💰', label: 'Max Scholarship', value: '₹25K', link: '/scholarship' },
  ];

  const recentApps = applications.slice(0, 3);

  return (
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

      {/* Stats */}
      <section className="dashboard-stats-section">
        <div className="container">
          <div className="dashboard-stats-grid">
            {stats.map((stat, i) => (
              <Link key={i} to={stat.link} className="dashboard-stat-card card-3d">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{loading ? '...' : stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-actions-section">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-title-premium">Quick <span className="title-highlight">Actions</span></h2>
          </div>
          <div className="quick-actions-grid">
            <Link to="/apply" className="quick-action-card card-3d">
              <div className="qa-icon">📝</div>
              <h3>New Application</h3>
              <p>Start a new college admission application</p>
              <span className="qa-arrow">→</span>
            </Link>
            <Link to="/colleges" className="quick-action-card card-3d">
              <div className="qa-icon">🏛️</div>
              <h3>Browse Colleges</h3>
              <p>Explore our network of partner colleges</p>
              <span className="qa-arrow">→</span>
            </Link>
            <Link to="/scholarship" className="quick-action-card card-3d">
              <div className="qa-icon">💰</div>
              <h3>Scholarships</h3>
              <p>Check scholarship eligibility and apply</p>
              <span className="qa-arrow">→</span>
            </Link>
            <Link to="/contact" className="quick-action-card card-3d">
              <div className="qa-icon">📞</div>
              <h3>Get Counseling</h3>
              <p>Talk to our expert admission counselors</p>
              <span className="qa-arrow">→</span>
            </Link>
          </div>
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
                  <div key={id || i} className="application-card card-3d">
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
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
