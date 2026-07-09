import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchMyApplications, downloadApplicationPDF } from '../services/api';
import PageTransition from '../components/common/PageTransition';

const STATUS_COLORS = {
    submitted: '#8B5CF6',
    under_review: '#3B82F6',
    approved: '#10B981',
    rejected: '#EF4444',
};

const STATUS_LABELS = {
    submitted: '📋 Submitted',
    under_review: '🔍 Under Review',
    approved: '✅ Approved',
    rejected: '❌ Rejected',
};

export default function MyApplications() {
    const location = useLocation();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(null);
    
    const [emailInput, setEmailInput] = useState('');
    const [searchedEmail, setSearchedEmail] = useState('');

    const fetchApplicationsForEmail = async (emailToFetch) => {
        if (!emailToFetch) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMyApplications(emailToFetch);
            setApplications(data.results || []);
            setSearchedEmail(emailToFetch);
            localStorage.setItem('met_lookup_email', emailToFetch);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch applications. Please check your email and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // 1. Check if email is passed in router state (from successful submission)
        if (location.state?.email) {
            setEmailInput(location.state.email);
            fetchApplicationsForEmail(location.state.email);
        } else {
            // 2. Check if we have a saved email in localStorage from previous lookup
            const savedEmail = localStorage.getItem('met_lookup_email');
            if (savedEmail) {
                setEmailInput(savedEmail);
                fetchApplicationsForEmail(savedEmail);
            }
        }
    }, [location.state]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmed = emailInput.trim();
        if (!trimmed) {
            setError('Please enter a valid email address.');
            return;
        }
        fetchApplicationsForEmail(trimmed);
    };

    const handleClearSearch = () => {
        setApplications([]);
        setSearchedEmail('');
        setEmailInput('');
        localStorage.removeItem('met_lookup_email');
    };

    const handleDownload = async (app) => {
        const id = app.id || app.application_id;
        setDownloading(id);
        try {
            const blob = await downloadApplicationPDF(id);
            const url = URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `application-${app.application_id}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch {
            alert('Could not download PDF. Please try again.');
        } finally {
            setDownloading(null);
        }
    };

    return (
        <PageTransition>
            <div className="applications-page">
            <section className="applications-hero">
                <div className="hero-bg-pattern" />
                <div className="container">
                    <div className="applications-hero-content">
                        <div className="section-label-premium"><span className="label-dot" />Track Status</div>
                        <h1>My <span className="title-highlight">Applications</span></h1>
                        <p>Verify and track the status of your scholarship applications using your registered email address.</p>
                    </div>
                </div>
            </section>

            <section className="applications-list-section">
                <div className="container">
                    {location.state?.message && (
                        <div className="success-banner card-3d" style={{ marginBottom: 30, background: '#10B98115', border: '1px solid #10B98140', padding: '16px 20px', borderRadius: 12, color: '#10B981' }}>
                            🎉 <strong>Success:</strong> {location.state.message}
                        </div>
                    )}

                    {/* Email Search Form (if not searched yet) */}
                    {!searchedEmail ? (
                        <div className="email-lookup-card card-3d" style={{ maxWidth: 550, margin: '0 auto', padding: '40px 30px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 15 }}>🔍</div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 10, fontWeight: 600 }}>Track Your Application</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: 25, fontSize: '0.95rem' }}>
                                Enter the registered email address used during the application process.
                            </p>
                            <form onSubmit={handleSearchSubmit}>
                                <div className="form-group" style={{ marginBottom: 20 }}>
                                    <input
                                        type="email"
                                        placeholder="enter.your.email@example.com"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        style={{ width: '100%', padding: '12px 18px', borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none' }}
                                        required
                                    />
                                    {error && <span className="form-error" style={{ display: 'block', marginTop: 8, color: 'var(--accent-red)' }}>{error}</span>}
                                </div>
                                <button type="submit" className="btn-dark w-full" style={{ padding: '12px' }} disabled={loading}>
                                    {loading ? 'Fetching...' : 'Check Status →'}
                                </button>
                            </form>
                            <div style={{ marginTop: 20, fontSize: '0.88rem' }}>
                                Need to submit a new one? <Link to="/apply" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Apply Now</Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Toolbar */}
                            <div className="applications-toolbar" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: 15, marginBottom: 25 }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Showing applications for:</span>{' '}
                                    <strong>{searchedEmail}</strong>
                                    <button onClick={handleClearSearch} style={{ marginLeft: 10, background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
                                        Change Email
                                    </button>
                                </div>
                                <Link to="/apply" className="btn-dark">+ New Application</Link>
                            </div>

                            {loading ? (
                                <div className="loading-grid">
                                    {[1, 2].map((n) => <div key={n} className="skeleton-card" style={{ height: '160px', borderRadius: 12, background: 'var(--bg-light)', border: '1px solid var(--border-color)', marginBottom: 15 }} />)}
                                </div>
                            ) : error ? (
                                <div className="error-state" style={{ textAlign: 'center', padding: '40px' }}>
                                    <div className="error-icon">⚠️</div>
                                    <h3>{error}</h3>
                                    <button onClick={() => fetchApplicationsForEmail(searchedEmail)} className="btn-dark" style={{ marginTop: 15 }}>Try Again</button>
                                </div>
                            ) : applications.length === 0 ? (
                                <div className="empty-applications" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <div className="empty-icon">📋</div>
                                    <h3>No Applications Found</h3>
                                    <p>We couldn't find any scholarship applications linked to <strong>{searchedEmail}</strong>.</p>
                                    <div style={{ marginTop: 20 }}>
                                        <Link to="/apply" className="btn-dark" style={{ marginRight: 10 }}>Apply Now</Link>
                                        <button onClick={handleClearSearch} className="btn-outline">Try another email</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="applications-list" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {applications.map((app) => {
                                        const id = app.id || app.application_id;
                                        const status = app.status || 'submitted';
                                        const statusColor = STATUS_COLORS[status] || '#666';
                                        const statusLabel = STATUS_LABELS[status] || status;

                                        return (
                                            <div key={app.application_id} className="application-card card-3d">
                                                <div className="app-card-header">
                                                    <div className="app-card-info">
                                                        <div className="app-card-id">Application ID: <strong>{app.application_id}</strong></div>
                                                        <h3 className="app-card-name">{app.full_name}</h3>
                                                        {app.college_name && (
                                                            <div className="app-card-college">
                                                                🏫 {app.college_name}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="app-status-badge" style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}40` }}>
                                                        {statusLabel}
                                                    </div>
                                                </div>

                                                <div className="app-card-meta">
                                                    {app.course_name && (
                                                        <span className="app-meta-item">📚 {app.course_name}</span>
                                                    )}
                                                    {app.department_name && (
                                                        <span className="app-meta-item">🏢 {app.department_name}</span>
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
                                                    <Link to={`/applications/${app.application_id}`} className="btn-view">View Details</Link>
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
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
        </PageTransition>
    );
}

