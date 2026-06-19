import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApplicationDetail, downloadApplicationPDF } from '../services/api';

const STATUS_COLORS = {
    pending: '#DAA520',
    approved: '#25D366',
    rejected: '#E53E3E',
    under_review: '#a78bfa',
    submitted: '#8B5CF6',
};

export default function ApplicationDetail() {
    const { id } = useParams();
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            try {
                setLoading(true);
                const data = await fetchApplicationDetail(id);
                setApp(data);
            } catch {
                setError('Failed to load application details.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleDownload = async () => {
        setDownloading(true);
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
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="applications-page">
                <div className="container" style={{ minHeight: '60vh', paddingTop: '120px' }}>
                    <div className="skeleton-card" style={{ height: '400px' }} />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !app) {
        return (
            <div className="applications-page">
                <div className="error-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3>{error || 'Application not found'}</h3>
                    <Link to="/applications" className="btn-dark">← Back to Applications</Link>
                </div>
            </div>
        );
    }

    const status = app.status || 'submitted';
    const statusColor = STATUS_COLORS[status] || '#666';

    const SECTIONS = [
        {
            title: 'Personal Information',
            icon: '👤',
            fields: [
                { label: 'Full Name', value: app.full_name || app.student_name },
                { label: 'Date of Birth', value: app.dob },
                { label: 'Gender', value: app.gender },
                { label: 'Nationality', value: app.nationality },
                { label: 'Mobile', value: app.mobile },
                { label: 'Email', value: app.email },
                { label: 'Address', value: app.address },
            ],
        },
        {
            title: 'Academic Details',
            icon: '📚',
            fields: [
                { label: '10th Percentage', value: app.tenth_percentage ? `${app.tenth_percentage}%` : null },
                { label: '12th Percentage', value: app.twelfth_percentage ? `${app.twelfth_percentage}%` : null },
                { label: '12th Stream', value: app.twelfth_stream },
                { label: 'Entrance Exam', value: app.entrance_exam },
                { label: 'Entrance Score / Rank', value: app.entrance_score },
            ],
        },
        {
            title: 'College Preference',
            icon: '🏛️',
            fields: [
                { label: 'College', value: app.college_name },
                { label: 'Course Preference', value: app.course_preference },
                { label: 'Quota Type', value: app.quota_type ? app.quota_type.charAt(0).toUpperCase() + app.quota_type.slice(1) + ' Quota' : null },
            ],
        },
    ];

    return (
        <div className="applications-page">
            <Navbar />

            {/* Header */}
            <section className="application-detail-hero">
                <div className="container">
                    <Link to="/my-applications" className="back-link">← All Applications</Link>
                    <div className="detail-hero-top">
                        <div>
                            <div className="section-label-premium"><span className="label-dot" />Application #{id}</div>
                            <h1 className="detail-app-title">{app.full_name || app.student_name || 'Applicant'}</h1>
                            {app.created_at && (
                                <p className="detail-app-date">Submitted on {new Date(app.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            )}
                        </div>
                        <div className="app-status-badge-large" style={{ background: `${statusColor}15`, color: statusColor, border: `2px solid ${statusColor}40` }}>
                            {status.replace('_', ' ').toUpperCase()}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="application-detail-content">
                <div className="container">
                    <div className="detail-content-grid">
                        <div className="detail-main">
                            {SECTIONS.map((section, si) => (
                                <div key={si} className="detail-card">
                                    <h2 className="detail-section-title">
                                        <span className="detail-section-icon">{section.icon}</span>
                                        {section.title}
                                    </h2>
                                    <div className="detail-fields-grid">
                                        {section.fields.filter((f) => f.value).map((field, fi) => (
                                            <div key={fi} className="detail-field">
                                                <span className="detail-field-label">{field.label}</span>
                                                <span className="detail-field-value">{field.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Rejection Reason */}
                            {status === 'rejected' && app.rejection_reason && (
                                <div className="detail-card rejection-card">
                                    <h2 className="detail-section-title">❌ Rejection Reason</h2>
                                    <p>{app.rejection_reason}</p>
                                    <Link to="/application-form" className="btn-dark">Reapply Now</Link>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="detail-sidebar">
                            <div className="detail-card sidebar-card">
                                <h3>Application Status</h3>
                                <div className="status-timeline">
                                    {['submitted', 'under_review', 'approved'].map((s, i) => (
                                        <div key={i} className={`timeline-item${status === s || (status === 'approved' && i <= 2) ? ' completed' : ''}${status === 'rejected' ? ' rejected' : ''}`}>
                                            <div className="timeline-dot" />
                                            <div className="timeline-content">
                                                <strong>{s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="sidebar-divider" />

                                <button className="btn-dark w-full" onClick={handleDownload} disabled={downloading}>
                                    {downloading ? 'Downloading...' : '⬇️ Download PDF'}
                                </button>
                                <Link to="/my-applications" className="btn-outline w-full" style={{ marginTop: '8px', display: 'block', textAlign: 'center' }}>
                                    ← All Applications
                                </Link>
                            </div>

                            <div className="detail-card sidebar-card cta-card">
                                <div className="cta-card-icon">📞</div>
                                <h3>Need Help?</h3>
                                <p>Questions about your application? Contact our support team.</p>
                                <a href="tel:+918925262724" className="btn-dark w-full">Call Us Now</a>
                                <a href="https://wa.me/+918925262724" className="btn-whatsapp w-full" target="_blank" rel="noreferrer" style={{ marginTop: '8px' }}>
                                    💬 WhatsApp
                                </a>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}
