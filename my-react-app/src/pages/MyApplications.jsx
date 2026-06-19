import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyApplications, downloadApplicationPDF } from '../services/api';

const STATUS_COLORS = {
    pending: '#DAA520',
    approved: '#25D366',
    rejected: '#E53E3E',
    under_review: '#a78bfa',
    submitted: '#8B5CF6',
};

const STATUS_LABELS = {
    pending: 'Pending',
    approved: '✅ Approved',
    rejected: '❌ Rejected',
    under_review: '🔍 Under Review',
    submitted: '📋 Submitted',
};

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            try {
                setLoading(true);
                const data = await fetchMyApplications();
                setApplications(Array.isArray(data) ? data : data.results || []);
            } catch {
                setError('Failed to load applications. Please try again.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleDownload = async (app) => {
        const id = app.id || app.application_id;
        setDownloading(id);
        try {
            const blob = await downloadApplicationPDF(id);
            const url = URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `application-${id}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch {
            alert('Could not download PDF. Please try again.');
        } finally {
            setDownloading(null);
        }
    };

    const filtered = applications.filter((app) => {
        const name = (app.full_name || app.student_name || '').toLowerCase();
        const college = (app.college_name || '').toLowerCase();
        const course = (app.course_preference || '').toLowerCase();
        return !search || name.includes(search.toLowerCase()) || college.includes(search.toLowerCase()) || course.includes(search.toLowerCase());
    });

    return (
        <div className="applications-page">

            <section className="applications-hero">
                <div className="hero-bg-pattern" />
                <div className="container">
                    <div className="applications-hero-content">
                        <div className="section-label-premium"><span className="label-dot" />My Dashboard</div>
                        <h1>My <span className="title-highlight">Applications</span></h1>
                        <p>Track the status of all your submitted college applications in one place.</p>
                    </div>
                </div>
            </section>

            <section className="applications-list-section">
                <div className="container">
                    {/* Search & Actions */}
                    <div className="applications-toolbar">
                        <div className="search-input-wrapper">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
                            <input type="text" placeholder="Search by name, college or course..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <Link to="/application-form" className="btn-dark">+ New Application</Link>
                    </div>

                    {loading ? (
                        <div className="loading-grid">
                            {[1, 2, 3].map((n) => <div key={n} className="skeleton-card" style={{ height: '160px' }} />)}
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <div className="error-icon">⚠️</div>
                            <h3>{error}</h3>
                            <button onClick={() => window.location.reload()} className="btn-dark">Try Again</button>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-applications">
                            <div className="empty-icon">📋</div>
                            <h3>{applications.length === 0 ? 'No Applications Yet' : 'No Results Found'}</h3>
                            <p>{applications.length === 0
                                ? 'You haven\'t submitted any applications yet. Start your college journey today!'
                                : 'No applications match your search. Try a different keyword.'}
                            </p>
                            {applications.length === 0 && (
                                <Link to="/application-form" className="btn-dark">Apply Now →</Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="results-count">
                                Showing <strong>{filtered.length}</strong> application{filtered.length !== 1 ? 's' : ''}
                            </div>
                            <div className="applications-list">
                                {filtered.map((app, i) => {
                                    const id = app.id || app.application_id;
                                    const status = app.status || 'submitted';
                                    const statusColor = STATUS_COLORS[status] || '#666';
                                    const statusLabel = STATUS_LABELS[status] || status;

                                    return (
                                        <div key={id || i} className="application-card card-3d">
                                            <div className="app-card-header">
                                                <div className="app-card-info">
                                                    <div className="app-card-id">Application #{id || i + 1}</div>
                                                    <h3 className="app-card-name">{app.full_name || app.student_name || 'Applicant'}</h3>
                                                    {app.college_name && (
                                                        <div className="app-card-college">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /></svg>
                                                            {app.college_name}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="app-status-badge" style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}40` }}>
                                                    {statusLabel}
                                                </div>
                                            </div>

                                            <div className="app-card-meta">
                                                {app.course_preference && (
                                                    <span className="app-meta-item">📚 {app.course_preference}</span>
                                                )}
                                                {app.quota_type && (
                                                    <span className="app-meta-item">🏷️ {app.quota_type.charAt(0).toUpperCase() + app.quota_type.slice(1)} Quota</span>
                                                )}
                                                {app.mobile && (
                                                    <span className="app-meta-item">📞 {app.mobile}</span>
                                                )}
                                                {app.created_at && (
                                                    <span className="app-meta-item">📅 {new Date(app.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                )}
                                            </div>

                                            {status === 'rejected' && app.rejection_reason && (
                                                <div className="app-rejection-note">
                                                    <strong>Reason:</strong> {app.rejection_reason}
                                                </div>
                                            )}

                                            <div className="app-card-actions">
                                                <Link to={`/my-applications/${id}`} className="btn-view">View Details</Link>
                                                <button
                                                    className="btn-download"
                                                    onClick={() => handleDownload(app)}
                                                    disabled={downloading === id}
                                                >
                                                    {downloading === id ? 'Downloading...' : '⬇️ Download PDF'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
