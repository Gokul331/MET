import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourses } from '../services/api';

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
        try {
          const { fetchCourseDetail } = await import('../services/api');
          const data = await fetchCourseDetail(id);
          setCourse(data);
        } catch {
          // fallback: search in list
          const allData = await fetchCourses();
          const list = Array.isArray(allData) ? allData : allData.results || [];
          const found = list.find((c) => String(c.id) === String(id) || c.slug === id);
          if (found) setCourse(found);
          else setError('Course not found.');
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
      <div className="course-detail-page">
        <div className="container" style={{ paddingTop: '120px' }}>
          <div className="skeleton-card" style={{ height: '300px' }} />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-page">
        <div className="error-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3>{error || 'Course not found'}</h3>
          <Link to="/courses" className="btn-dark">← Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <section className="course-detail-hero">
        <div className="hero-bg-pattern" />
        <div className="container">
          <Link to="/courses" className="back-link">← All Courses</Link>
          <div className="cd-hero-content">
            <div className="section-label-premium"><span className="label-dot" />{course.category || 'Course'}</div>
            <h1>{course.title || course.name || 'Course Details'}</h1>
            <p>{course.description || ''}</p>
          </div>
        </div>
      </section>

      <section className="course-detail-content">
        <div className="container">
          <div className="cd-info-grid">
            <div className="cd-card card-3d">
              <h2><span>📋</span> Course Overview</h2>
              <div className="cd-info-list">
                {course.duration && <div className="cd-info-row"><span>Duration</span><strong>{course.duration}</strong></div>}
                {course.level && <div className="cd-info-row"><span>Level</span><strong>{course.level}</strong></div>}
                {course.category && <div className="cd-info-row"><span>Category</span><strong>{course.category}</strong></div>}
                {course.students && <div className="cd-info-row"><span>Students Enrolled</span><strong>{course.students}+</strong></div>}
                {course.rating && <div className="cd-info-row"><span>Rating</span><strong>⭐ {course.rating}/5</strong></div>}
              </div>
            </div>
            <div className="cd-card cta-card card-3d">
              <div className="cta-card-icon">🎓</div>
              <h3>Interested in this course?</h3>
              <p>Apply now or speak to our counselors for personalized guidance.</p>
              <Link to="/apply" className="btn-dark w-full">Apply Now →</Link>
              <a href="tel:+919843139330" className="btn-outline w-full" style={{ marginTop: '10px', display: 'block', textAlign: 'center' }}>
                📞 Talk to Counselor
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
