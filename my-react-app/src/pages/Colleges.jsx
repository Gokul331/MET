import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchColleges } from '../services/api';

const FILTERS = ['All', 'Engineering', 'Medical', 'Nursing', 'Arts & Science', 'Management', 'Law'];

export default function Colleges() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchColleges();
        setColleges(Array.isArray(data) ? data : data.results || []);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = colleges.filter((c) => {
    const name = (c.college_name || c.name || '').toLowerCase();
    const city = (c.location_city || '').toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || city.includes(search.toLowerCase());
    const courses = c.courses_offered_display || c.courses_offered || [];
    const matchFilter = activeFilter === 'All' || courses.some((co) =>
      co.toLowerCase().includes(activeFilter.toLowerCase())
    );
    return matchSearch && matchFilter;
  });

  return (
    <div className="colleges-page">
      {/* Hero */}
      <section className="colleges-hero">
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="colleges-hero-content">
            <div className="section-label-premium"><span className="label-dot" />Our Network</div>
            <h1>Branch <span className="title-highlight">Colleges</span></h1>
            <p>Explore our curated network of top-ranked colleges across Tamil Nadu offering quality education in Engineering, Medical, and more.</p>
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
                placeholder="Search by college name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-tabs">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-tab${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Colleges Grid */}
      <section className="colleges-grid-section">
        <div className="container">
          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className="skeleton-card" style={{ height: '320px' }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-applications">
              <div className="empty-icon">🏛️</div>
              <h3>No Colleges Found</h3>
              <p>Try a different search term or filter.</p>
              <button className="btn-dark" onClick={() => { setSearch(''); setActiveFilter('All'); }}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="results-count">
                Showing <strong>{filtered.length}</strong> college{filtered.length !== 1 ? 's' : ''}
              </div>
              <div className="colleges-grid">
                {filtered.map((college, i) => {
                  const id = college.college_id || college.id;
                  const name = college.college_name || college.name || 'College';
                  const slug = college.short_name || id;
                  const city = college.location_city || '';
                  const state = college.location_state || 'Tamil Nadu';
                  const img = college.primary_image || college.banner_image || college.college_images?.[0] || null;
                  const courses = college.courses_offered_display || college.courses_offered || [];

                  return (
                    <div key={id || i} className="college-card card-3d">
                      <div className="college-card-image">
                        {img ? (
                          <img
                            src={img}
                            alt={name}
                            onError={(e) => {
                              e.target.parentElement.innerHTML = '<div class="college-img-placeholder">🏛️</div>';
                            }}
                          />
                        ) : (
                          <div className="college-img-placeholder">🏛️</div>
                        )}
                        <div className="college-card-badge">{college.short_name || 'MET'}</div>
                      </div>
                      <div className="college-card-body">
                        <h3 className="college-card-name">{name}</h3>
                        {city && (
                          <p className="college-card-location">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            {city}, {state}
                          </p>
                        )}
                        {courses.length > 0 && (
                          <div className="college-courses-tags">
                            {courses.slice(0, 3).map((c, j) => (
                              <span key={j} className="course-tag">{c}</span>
                            ))}
                            {courses.length > 3 && <span className="course-tag more">+{courses.length - 3}</span>}
                          </div>
                        )}
                        <div className="college-card-actions">
                          <Link to={`/colleges/${slug}`} className="btn-dark btn-sm">View Details</Link>
                          <Link to="/apply" state={{ college }} className="btn-outline btn-sm">Apply Now</Link>
                        </div>
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
