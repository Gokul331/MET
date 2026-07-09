import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourses, groupCoursesByName, getCourseImage } from '../services/api';
import PageTransition from '../components/common/PageTransition';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        setLoading(true);
        const allData = await fetchCourses();
        const list = Array.isArray(allData) ? allData : allData.results || [];
        const groupedList = groupCoursesByName(list.length > 0 ? list : []);
        
        const found = groupedList.find(
          (c) => String(c.id) === String(id) || String(c.course_id) === String(id)
        );
        if (found) {
          setCourse(found);
        } else {
          setError('Course not found.');
        }
      } catch {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="course-detail-page">
          <div className="container" style={{ paddingTop: '120px' }}>
            <div className="skeleton-card" style={{ height: '300px' }} />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !course) {
    return (
      <PageTransition>
        <div className="course-detail-page">
          <div className="error-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3>{error || 'Course not found'}</h3>
            <Link to="/courses" className="btn-dark">← Back to Courses</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="course-detail-page-premium" style={{ background: '#fcfcfc', paddingBottom: '100px' }}>
        
        {/* ── Split Hero Section ── */}
        <section className="course-detail-hero" style={{ padding: '140px 0 70px', background: '#fff', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
          <div className="hero-bg-pattern" />
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
              
              {/* Left Column: Info */}
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <Link to="/courses" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none' }}>
                    ← Back to Courses
                  </Link>
                </div>
                <div className="section-label-premium" style={{ display: 'inline-flex', marginBottom: '14px' }}>
                  <span className="label-dot" /> {course.category_display || course.category || 'Academic Course'}
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 16px', lineHeight: 1.25 }}>
                  {course.title || course.course_name || course.name}
                </h1>
                <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px', maxWidth: '520px' }}>
                  {course.description || 'Gain in-depth technical expertise and practical training in this comprehensive academic program designed by leading educators.'}
                </p>

                {/* Status Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ background: 'var(--blue-pale)', border: '1px solid rgba(37, 99, 235, 0.15)', padding: '8px 16px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--blue)', fontWeight: 700 }}>
                    ⏱ <span>Duration: {course.duration || '3–4 Years'}</span>
                  </div>
                  <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                    🎓 <span>Degree: {course.level || course.degree_type_display || 'UG'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Image Card */}
              <div className="card-3d" style={{ position: 'relative', borderRadius: '28px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', height: '340px' }}>
                <img
                  src={getCourseImage(course.course_name || course.title || course.name, course.category_display || course.category)}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '16px 20px', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>Admissions Open</h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>Enroll through Mari Educational Trust for scholarship advantages.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Content Section ── */}
        <section style={{ marginTop: '60px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
              
              {/* Left Column: Colleges (8 cols) */}
              <div style={{ gridColumn: 'span 8' }}>
                <div className="section-label-premium" style={{ display: 'inline-flex' }}>
                  <span className="label-dot" /> Course Providers
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 28px' }}>
                  Colleges Offering <span className="title-highlight">This Program</span>
                </h2>

                {course.colleges_info && course.colleges_info.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {course.colleges_info.map((col) => (
                      <div key={col.id} className="college-card-premium card-3d" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
                        <div style={{ height: '120px', background: 'var(--blue-pale)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                          🏛️
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                          <div>
                            <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>{col.college_name}</h3>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0 0 16px', fontWeight: 600 }}>
                              📍 {col.location_city}, {col.location_state}
                            </p>
                          </div>
                          <Link 
                            to={col.short_name ? `/colleges/${col.short_name}` : '/colleges'} 
                            className="btn-outline btn-sm" 
                            style={{ textAlign: 'center', padding: '10px 14px', fontSize: '0.78rem', textDecoration: 'none' }}
                          >
                            View College Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '24px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>🏛️</div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>No Associated Colleges Found</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Contact counselor to find seats for this course in our colleges.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Admission CTA Sidebar (4 cols) */}
              <div style={{ gridColumn: 'span 4' }}>
                <div style={{ position: 'sticky', top: '100px' }}>
                  <div className="card-3d" style={{ background: 'linear-gradient(185deg, var(--blue) 0%, #1d4ed8 100%)', padding: '32px', borderRadius: '28px', color: '#fff', boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎓</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Secure Your Admission</h3>
                    <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '24px' }}>
                      Get direct enrollment counseling, seat bookings, and exclusive trust scholarship benefits.
                    </p>
                    <Link to="/apply" state={{ course: course }} className="btn-light w-full" style={{ background: '#fff', color: 'var(--blue)', fontWeight: 800, padding: '12px', borderRadius: '12px', display: 'block', textAlign: 'center', textDecoration: 'none', transition: 'all 0.2s' }}>
                      Apply Now →
                    </Link>
                    <a href="tel:+919941489330" style={{ display: 'block', textAlign: 'center', color: '#fff', marginTop: '16px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', opacity: 0.9 }}>
                      📞 Speak to Counselors
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
