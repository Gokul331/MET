import React, { useState, useEffect } from 'react';
import { fetchCourses } from '../services/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const COURSE_CATEGORIES = ['All', 'Engineering', 'Medical', 'Nursing', 'Allied Health', 'Arts & Science', 'Management', 'Law', 'Architecture', 'Pharmacy'];

const DEFAULT_COURSES = [
  { id: 1, title: 'Engineering', category: 'Engineering', level: 'Undergraduate', duration: '4 Years', students: 450, rating: 4.8, icon: '⚙️', description: 'B.E / B.Tech programs in CS, ECE, Mechanical, Civil, and more.' },
  { id: 2, title: 'Medical (MBBS)', category: 'Medical', level: 'Undergraduate', duration: '5.5 Years', students: 200, rating: 4.9, icon: '🩺', description: 'MBBS, BDS, and allied medical programs in top institutions.' },
  { id: 3, title: 'Nursing (B.Sc)', category: 'Nursing', level: 'Undergraduate', duration: '4 Years', students: 300, rating: 4.7, icon: '💉', description: 'B.Sc Nursing and P.B.B.Sc Nursing programs with clinical training.' },
  { id: 4, title: 'Allied Health Sciences', category: 'Allied Health', level: 'Undergraduate', duration: '3 Years', students: 250, rating: 4.6, icon: '🏥', description: 'Physiotherapy, Lab Tech, Radiology, and more healthcare programs.' },
  { id: 5, title: 'Arts & Science', category: 'Arts & Science', level: 'Undergraduate', duration: '3 Years', students: 380, rating: 4.5, icon: '📖', description: 'BA, BSc, BCom programs across various disciplines.' },
  { id: 6, title: 'MBA / MCA', category: 'Management', level: 'Postgraduate', duration: '2 Years', students: 280, rating: 4.7, icon: '💼', description: 'Master of Business Administration and Computer Applications.' },
  { id: 7, title: 'Law (LLB)', category: 'Law', level: 'Undergraduate', duration: '3-5 Years', students: 150, rating: 4.6, icon: '⚖️', description: '3-Year LLB and 5-Year integrated BA LLB programs.' },
  { id: 8, title: 'Architecture (B.Arch)', category: 'Architecture', level: 'Undergraduate', duration: '5 Years', students: 100, rating: 4.7, icon: '🏛️', description: 'Bachelor of Architecture with hands-on studio training.' },
  { id: 9, title: 'Pharmacy (B.Pharm)', category: 'Pharmacy', level: 'Undergraduate', duration: '4 Years', students: 180, rating: 4.6, icon: '💊', description: 'B.Pharm and D.Pharm programs with industry exposure.' },
  { id: 10, title: 'Polytechnic / Diploma', category: 'Engineering', level: 'Diploma', duration: '3 Years', students: 320, rating: 4.4, icon: '🔧', description: 'Diploma programs in Engineering and Technology.' },
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await fetchCourses();
        const data = Array.isArray(response) ? response : response.results || [];
        setCourses(data.length > 0 ? data : DEFAULT_COURSES);
      } catch {
        setCourses(DEFAULT_COURSES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const title = (course.title || course.name || '').toLowerCase();
    const desc = (course.description || '').toLowerCase();
    const cat = (course.category || '').toLowerCase();
    const matchSearch = !searchTerm || title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'All' || cat.includes(activeCategory.toLowerCase()) || title.includes(activeCategory.toLowerCase());
    return matchSearch && matchCat;
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="courses-page">
      {/* Hero */}
      <section className="colleges-hero">
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="colleges-hero-content">
            <div className="section-label-premium"><span className="label-dot" />Our Programs</div>
            <h1>Courses & <span className="title-highlight">Programs</span></h1>
            <p>Explore a wide range of courses across Engineering, Medical, Sciences, and Management offered at our branch colleges.</p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="colleges-search-section">
        <div className="container">
          <div className="colleges-toolbar">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-tabs">
            {COURSE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-tab${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="colleges-grid-section">
        <div className="container">
          {filteredCourses.length === 0 ? (
            <div className="empty-applications">
              <div className="empty-icon">📚</div>
              <h3>No Courses Found</h3>
              <p>Try a different search term or category.</p>
              <button className="btn-dark" onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="results-count">
                Showing <strong>{filteredCourses.length}</strong> course{filteredCourses.length !== 1 ? 's' : ''}
              </div>
              <div className="courses-grid">
                {filteredCourses.map((course, i) => {
                  const id = course.id || i + 1;
                  return (
                    <div key={id} className="course-card card-3d">
                      <div className="course-card-header">
                        <div className="course-icon">{course.icon || '📚'}</div>
                        <div className="course-level-badge">{course.level || 'Undergraduate'}</div>
                      </div>
                      <h3 className="course-card-title">{course.title || course.name || 'Course'}</h3>
                      <p className="course-card-desc">{course.description || ''}</p>
                      <div className="course-card-meta">
                        {course.duration && <span className="course-meta-item">⏱ {course.duration}</span>}
                        {course.students && <span className="course-meta-item">👥 {course.students}+ students</span>}
                        {course.rating && <span className="course-meta-item">⭐ {course.rating}</span>}
                      </div>
                      <div className="course-card-actions">
                        <Link to="/apply" className="btn-dark btn-sm">Apply Now</Link>
                        <a href="tel:+919843139330" className="btn-outline btn-sm">📞 Enquire</a>
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
};

export default Courses;