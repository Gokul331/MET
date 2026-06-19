import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCollegeDetail, fetchColleges } from '../services/api';

export default function CollegeDetail() {
  const { slug } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        setLoading(true);
        // Try by slug first, then search by ID in list
        try {
          const data = await fetchCollegeDetail(slug);
          setCollege(data);
        } catch {
          // Fallback: fetch all and find by id or short_name
          const allData = await fetchColleges();
          const list = Array.isArray(allData) ? allData : allData.results || [];
          const found = list.find(
            (c) => String(c.college_id || c.id) === String(slug) || c.short_name === slug
          );
          if (found) setCollege(found);
          else setError('College not found.');
        }
      } catch {
        setError('Failed to load college details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="college-detail-page">
        <div className="container" style={{ paddingTop: '120px' }}>
          <div className="skeleton-card" style={{ height: '400px' }} />
          <div className="skeleton-card" style={{ height: '200px', marginTop: '24px' }} />
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="college-detail-page">
        <div className="error-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3>{error || 'College not found'}</h3>
          <Link to="/colleges" className="btn-dark">← Back to Colleges</Link>
        </div>
      </div>
    );
  }

  const name = college.college_name || college.name || 'College';
  const city = college.location_city || '';
  const state = college.location_state || 'Tamil Nadu';
  const images = [
    college.primary_image,
    college.banner_image,
    ...(college.college_images || []),
    ...(college.campus_images || []),
  ].filter(Boolean).slice(0, 6);
  const courses = college.courses_offered_display || college.courses_offered || [];

  return (
    <div className="college-detail-page">
      {/* Hero */}
      <section className="college-detail-hero">
        <div className="hero-bg-pattern" />
        <div className="container">
          <Link to="/colleges" className="back-link">← All Colleges</Link>
          <div className="cd-hero-content">
            <div className="section-label-premium"><span className="label-dot" />{college.short_name || 'MET Branch'}</div>
            <h1>{name}</h1>
            {city && (
              <p className="cd-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {city}, {state}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="college-detail-content">
        <div className="container">
          <div className="cd-layout">
            {/* Gallery */}
            {images.length > 0 && (
              <div className="cd-gallery">
                <div className="cd-main-img">
                  <img
                    src={images[activeImg]}
                    alt={name}
                    onError={(e) => { e.target.src = ''; e.target.parentElement.innerHTML = '<div class="college-img-placeholder large">🏛️</div>'; }}
                  />
                </div>
                {images.length > 1 && (
                  <div className="cd-thumbnails">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        className={`cd-thumb${activeImg === i ? ' active' : ''}`}
                        onClick={() => setActiveImg(i)}
                      >
                        <img src={img} alt={`View ${i + 1}`} onError={(e) => { e.target.parentElement.style.display = 'none'; }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Info */}
            <div className="cd-info-grid">
              {/* Courses */}
              {courses.length > 0 && (
                <div className="cd-card card-3d">
                  <h2><span>📚</span> Courses Offered</h2>
                  <div className="cd-courses-list">
                    {courses.map((c, i) => (
                      <div key={i} className="cd-course-item">
                        <span className="cd-course-dot" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="cd-card card-3d">
                <h2><span>ℹ️</span> Quick Information</h2>
                <div className="cd-info-list">
                  {college.affiliation && <div className="cd-info-row"><span>Affiliation</span><strong>{college.affiliation}</strong></div>}
                  {college.established && <div className="cd-info-row"><span>Established</span><strong>{college.established}</strong></div>}
                  <div className="cd-info-row"><span>Location</span><strong>{city}, {state}</strong></div>
                  {college.rating && <div className="cd-info-row"><span>Rating</span><strong>{'⭐'.repeat(Math.round(college.rating))} {college.rating}/5</strong></div>}
                </div>
              </div>

              {/* CTA */}
              <div className="cd-card cta-card card-3d">
                <div className="cta-card-icon">🎓</div>
                <h3>Interested in {college.short_name || 'this college'}?</h3>
                <p>Let our counselors guide you through the admission process.</p>
                <Link to="/apply" state={{ college }} className="btn-dark w-full">Apply Now →</Link>
                <a href="tel:+919843139330" className="btn-outline w-full" style={{ marginTop: '10px', display: 'block', textAlign: 'center' }}>
                  📞 Talk to Counselor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
