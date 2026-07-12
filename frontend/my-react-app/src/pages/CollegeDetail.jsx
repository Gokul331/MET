import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCollegeDetail, fetchColleges, fetchCourses } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import fallbackImg from '../assets/colleges_hero_3.jpg';

export default function CollegeDetail() {
  const { slug } = useParams();
  const [college, setCollege] = useState(null);
  const [collegeCourses, setCollegeCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        setLoading(true);
        let activeCollege = null;
        try {
          const data = await fetchCollegeDetail(slug);
          setCollege(data);
          activeCollege = data;
        } catch {
          const allData = await fetchColleges();
          const list = Array.isArray(allData) ? allData : allData.results || [];
          const found = list.find(
            (c) => String(c.college_id || c.id) === String(slug) || c.short_name === slug
          );
          if (found) {
            setCollege(found);
            activeCollege = found;
          } else {
            setError('College not found.');
          }
        }

        if (activeCollege) {
          try {
            const allCourses = await fetchCourses();
            const list = Array.isArray(allCourses) ? allCourses : allCourses.results || [];
            const colId = activeCollege.college_id || activeCollege.id;
            const filtered = list.filter(c =>
              c.college === colId ||
              c.college_details?.college_id === colId
            );
            setCollegeCourses(filtered);
          } catch (err) {
            console.error('Failed to load college courses', err);
          }
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
      <PageTransition>
        <div className="college-detail-page" style={{ padding: '130px 0 60px' }}>
          <div className="container">
            <div className="skeleton-card" style={{ height: '400px', borderRadius: '24px' }} />
            <div className="skeleton-card" style={{ height: '200px', marginTop: '24px', borderRadius: '16px' }} />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !college) {
    return (
      <PageTransition>
        <div className="college-detail-page" style={{ padding: '130px 0 60px' }}>
          <div className="container">
            <div className="error-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h3 style={{ marginBottom: '16px' }}>{error || 'College not found'}</h3>
              <Link to="/colleges" className="btn-primary">← Back to Colleges</Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const name = college.college_name || college.name || 'College';
  const city = college.location_city || '';
  const state = college.location_state || 'Tamil Nadu';
  const images = [
    college.primary_image_url,
    college.primary_image,
    college.banner_image_url,
    college.banner_image,
    ...(college.college_images || []),
    ...(college.campus_images || []),
  ].filter(Boolean).slice(0, 6);

  // Set fallback image if empty
  if (images.length === 0) {
    images.push(fallbackImg);
  }

  const streams = college.courses_offered_display || college.courses_offered || [];

  // Group database course objects by their stream category
  const coursesByCategory = {};

  // Initialize all streams offered by the college with empty arrays
  streams.forEach(stream => {
    let category = stream;
    const sL = stream.toLowerCase();
    if (sL.includes('engineering')) category = 'Engineering & Technology';
    else if (sL.includes('nursing')) category = 'Nursing & Midwifery';
    else if (sL.includes('pharmacy') || sL.includes('pharm')) category = 'Pharmacy & Pharmaceutical Sciences';
    else if (sL.includes('agricultural') || sL.includes('agriculture')) category = 'Agricultural Sciences';
    else if (sL.includes('law')) category = 'Law & Jurisprudence';
    else if (sL.includes('physio')) category = 'Physiotherapy';
    else if (sL.includes('allied') || sL.includes('health')) category = 'Allied Health Sciences';
    else if (sL.includes('management') || sL.includes('business')) category = 'Management & Business Studies';
    else if (sL.includes('computer') || sL.includes('mca')) category = 'Computer Applications';
    else if (sL.includes('polytechnic')) category = 'Polytechnic Diploma';
    else if (sL.includes('architecture')) category = 'Architecture';
    else if (sL.includes('arts') || sL.includes('science')) category = 'Arts & Science';

    if (!coursesByCategory[category]) {
      coursesByCategory[category] = [];
    }
  });

  // Put database courses into their respective categories
  collegeCourses.forEach(c => {
    const title = c.course_name || c.title || c.name || '';
    const cat = c.category_display || c.category || '';
    const catL = cat.toLowerCase();
    const titleL = title.toLowerCase();

    let category = 'Arts & Science';
    if (catL.includes('engineering') || titleL.includes('engineering') || titleL.includes('b.e') || titleL.includes('b.tech')) {
      category = 'Engineering & Technology';
    } else if (catL.includes('nursing') || titleL.includes('nursing')) {
      category = 'Nursing & Midwifery';
    } else if (catL.includes('pharmacy') || titleL.includes('pharm')) {
      category = 'Pharmacy & Pharmaceutical Sciences';
    } else if (catL.includes('agriculture') || titleL.includes('agriculture')) {
      category = 'Agricultural Sciences';
    } else if (catL.includes('law') || titleL.includes('law') || titleL.includes('llb')) {
      category = 'Law & Jurisprudence';
    } else if (titleL.includes('physio') || titleL.includes('bpt')) {
      category = 'Physiotherapy';
    } else if (catL.includes('allied') || catL.includes('health') || titleL.includes('allied')) {
      category = 'Allied Health Sciences';
    } else if (catL.includes('management') || titleL.includes('mba') || titleL.includes('bba')) {
      category = 'Management & Business Studies';
    } else if (catL.includes('computer') || titleL.includes('mca')) {
      category = 'Computer Applications';
    } else if (catL.includes('polytechnic') || titleL.includes('diploma')) {
      category = 'Polytechnic Diploma';
    } else if (catL.includes('architecture') || titleL.includes('architecture') || titleL.includes('b.arch')) {
      category = 'Architecture';
    }

    if (!coursesByCategory[category]) {
      coursesByCategory[category] = [];
    }

    if (!coursesByCategory[category].some(item => (item.course_name || item.title || item.name || '') === title)) {
      coursesByCategory[category].push(c);
    }
  });

  // Fallback realistic courses if a category has 0 courses in the database
  const fallbacks = {
    'Engineering & Technology': [
      { id: 'fe1', course_name: 'B.E. Computer Science & Engineering', duration: '4 Years', icon: '⚙️', level: 'UG' },
      { id: 'fe2', course_name: 'B.E. Electronics & Communication Engineering', duration: '4 Years', icon: '⚙️', level: 'UG' },
      { id: 'fe3', course_name: 'B.E. Mechanical Engineering', duration: '4 Years', icon: '⚙️', level: 'UG' },
      { id: 'fe4', course_name: 'B.Tech. Information Technology', duration: '4 Years', icon: '⚙️', level: 'UG' },
      { id: 'fe5', course_name: 'B.E. Biomedical Engineering', duration: '4 Years', icon: '⚙️', level: 'UG' }
    ],
    'Nursing & Midwifery': [
      { id: 'fn1', course_name: 'B.Sc. Nursing', duration: '4 Years', icon: '💉', level: 'UG' },
      { id: 'fn2', course_name: 'Post Basic B.Sc. Nursing', duration: '2 Years', icon: '💉', level: 'UG' }
    ],
    'Pharmacy & Pharmaceutical Sciences': [
      { id: 'fp1', course_name: 'B.Pharm (Bachelor of Pharmacy)', duration: '4 Years', icon: '💊', level: 'UG' },
      { id: 'fp2', course_name: 'D.Pharm (Diploma in Pharmacy)', duration: '2 Years', icon: '💊', level: 'Diploma' },
      { id: 'fp3', course_name: 'Pharm.D (Doctor of Pharmacy)', duration: '6 Years', icon: '💊', level: 'UG' }
    ],
    'Agricultural Sciences': [
      { id: 'fa1', course_name: 'B.Sc. (Hons) Agriculture', duration: '4 Years', icon: '🌾', level: 'UG' },
      { id: 'fa2', course_name: 'B.Tech. Agricultural Engineering', duration: '4 Years', icon: '🌾', level: 'UG' }
    ],
    'Law & Jurisprudence': [
      { id: 'fl1', course_name: 'B.A. LL.B. (Hons)', duration: '5 Years', icon: '⚖️', level: 'UG' },
      { id: 'fl2', course_name: 'B.B.A. LL.B. (Hons)', duration: '5 Years', icon: '⚖️', level: 'UG' },
      { id: 'fl3', course_name: 'LL.B. (Bachelor of Laws)', duration: '3 Years', icon: '⚖️', level: 'UG' }
    ],
    'Physiotherapy': [
      { id: 'fpt1', course_name: 'B.P.T. (Bachelor of Physiotherapy)', duration: '4.5 Years', icon: '🏥', level: 'UG' }
    ],
    'Allied Health Sciences': [
      { id: 'fah1', course_name: 'B.Sc. Cardiac Technology', duration: '3 Years', icon: '🏥', level: 'UG' },
      { id: 'fah2', course_name: 'B.Sc. Radiography & Imaging Technology', duration: '3 Years', icon: '🏥', level: 'UG' },
      { id: 'fah3', course_name: 'B.Sc. Operation Theatre & Anesthesia', duration: '3 Years', icon: '🏥', level: 'UG' }
    ],
    'Management & Business Studies': [
      { id: 'fm1', course_name: 'M.B.A. (Master of Business Administration)', duration: '2 Years', icon: '💼', level: 'PG' },
      { id: 'fm2', course_name: 'B.B.A. (Bachelor of Business Administration)', duration: '3 Years', icon: '💼', level: 'UG' }
    ],
    'Computer Applications': [
      { id: 'fc1', course_name: 'M.C.A. (Master of Computer Applications)', duration: '2 Years', icon: '💻', level: 'PG' }
    ],
    'Polytechnic Diploma': [
      { id: 'fpo1', course_name: 'Diploma in Mechanical Engineering', duration: '3 Years', icon: '🔧', level: 'Diploma' },
      { id: 'fpo2', course_name: 'Diploma in Computer Engineering', duration: '3 Years', icon: '💻', level: 'Diploma' }
    ],
    'Architecture': [
      { id: 'far1', course_name: 'B.Arch. (Bachelor of Architecture)', duration: '5 Years', icon: '🏛️', level: 'UG' }
    ],
    'Arts & Science': [
      { id: 'fas1', course_name: 'B.Sc. Computer Science', duration: '3 Years', icon: '📖', level: 'UG' },
      { id: 'fas2', course_name: 'B.Sc. Biotechnology', duration: '3 Years', icon: '📖', level: 'UG' },
      { id: 'fas3', course_name: 'B.Com. General', duration: '3 Years', icon: '💼', level: 'UG' }
    ]
  };

  // Populate any empty category array with fallback values
  Object.keys(coursesByCategory).forEach(cat => {
    if (coursesByCategory[cat].length === 0 && fallbacks[cat]) {
      coursesByCategory[cat] = fallbacks[cat];
    }
  });

  // Sort categories by number of courses descending to lay out the tallest first
  const sortedCategories = Object.keys(coursesByCategory).sort((a, b) => {
    return coursesByCategory[b].length - coursesByCategory[a].length;
  });

  // Distribute into left and right columns to balance heights/weights
  const leftColCategories = [];
  const rightColCategories = [];
  let leftWeight = 0;
  let rightWeight = 0;

  sortedCategories.forEach(catName => {
    const weight = coursesByCategory[catName].length + 2; // +2 weight for card header/styling padding
    if (leftWeight <= rightWeight) {
      leftColCategories.push(catName);
      leftWeight += weight;
    } else {
      rightColCategories.push(catName);
      rightWeight += weight;
    }
  });

  const renderCategoryCard = (catName) => {
    const catL = catName.toLowerCase();
    let streamClass = 'stream-default';
    let icon = '🎓';

    if (catL.includes('engineering')) {
      streamClass = 'stream-engineering';
      icon = '⚙️';
    } else if (catL.includes('nursing')) {
      streamClass = 'stream-nursing';
      icon = '💉';
    } else if (catL.includes('pharmacy') || catL.includes('pharm')) {
      streamClass = 'stream-pharmacy';
      icon = '💊';
    } else if (catL.includes('agriculture') || catL.includes('agricultural')) {
      streamClass = 'stream-agriculture';
      icon = '🌾';
    } else if (catL.includes('law')) {
      streamClass = 'stream-law';
      icon = '⚖️';
    } else if (catL.includes('physio')) {
      streamClass = 'stream-allied';
      icon = '🏥';
    } else if (catL.includes('allied') || catL.includes('health')) {
      streamClass = 'stream-allied';
      icon = '🏥';
    } else if (catL.includes('management') || catL.includes('business')) {
      streamClass = 'stream-management';
      icon = '💼';
    } else if (catL.includes('computer') || catL.includes('mca')) {
      streamClass = 'stream-management';
      icon = '💻';
    } else if (catL.includes('polytechnic')) {
      streamClass = 'stream-engineering';
      icon = '🔧';
    } else if (catL.includes('architecture')) {
      streamClass = 'stream-default';
      icon = '🏛️';
    }

    return (
      <div
        key={catName}
        className={`course-card-premium card-3d ${streamClass}`}
        style={{
          padding: '30px',
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          justifyContent: 'flex-start',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          {/* Header: Category name and icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <span style={{ fontSize: '1.8rem' }}>{icon}</span>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {catName}
              </h3>
            </div>
          </div>

          {/* Body: list of courses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {coursesByCategory[catName].map((course, i) => {
              const cName = course.course_name || course.title || course.name || '';
              return (
                <div
                  key={course.id || i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '8px 0',
                    borderBottom: i < coursesByCategory[catName].length - 1 ? '1px dashed var(--border-color)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600, lineHeight: 1.35 }}>
                    • {cName}
                  </span>
                  <Link
                    to="/apply"
                    state={{ college, course: course }}
                    className="btn-text-apply"
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--blue)',
                      textDecoration: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: 'var(--blue-pale)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Apply
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const courses = streams;

  return (
    <PageTransition>
      <div className="college-detail-page-premium" style={{ background: '#fcfcfc', paddingBottom: '80px' }}>

        {/* ── Section 1: Split Hero Header (Universite Style) ── */}
        <section className="college-detail-hero" style={{ padding: '130px 0 60px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
          <div className="hero-bg-pattern" />
          <div className="container">

            <div style={{ marginBottom: '24px' }}>
              <Link to="/colleges" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none' }}>
                ← Back to Colleges
              </Link>
            </div>

            <div className="cd-classic-hero-container" style={{ textAlign: 'left', maxWidth: '1000px', margin: '0 auto 48px', padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
              
              {/* Primary Image with Absolute Positioned Text */}
              <div className="cd-hero-visual-frame" style={{ position: 'relative', height: '350px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}>
                <img
                  src={images[activeImg]}
                  alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80';
                  }}
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)', zIndex: 1 }} />

                {/* Absolute Text Container */}
                <div style={{ position: 'absolute', bottom: '24px', left: '32px', right: '32px', zIndex: 2, color: 'white' }}>
                  <div className="section-label-premium" style={{ display: 'inline-flex', marginBottom: '8px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: '#fff', border: 'none' }}>
                    <span className="label-dot" style={{ background: '#4ade80' }} /> {college.short_name || 'MET Institute'}
                  </div>
                  <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px', letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#fff' }}>
                    {name}
                  </h1>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    {city && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📍 {city}, {state}
                      </span>
                    )}
                    {college.rating && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ⭐ {college.rating} / 5 Rating
                      </span>
                    )}
                    {college.established && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📅 Estd. {college.established}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="cd-thumbnails-row" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`cd-thumbnail-btn${activeImg === i ? ' active' : ''}`}
                      onClick={() => setActiveImg(i)}
                      style={{ width: '80px', height: '60px', borderRadius: '12px', border: activeImg === i ? '3px solid var(--blue)' : '3px solid transparent', padding: '0', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="cd-btn-group" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
                <Link to="/apply" state={{ college }} className="btn-primary" style={{ padding: '14px 36px', fontSize: '1.05rem', minWidth: '200px', textAlign: 'center' }}>
                  Apply For Seat
                </Link>
                <a href="tel:+919843139330" className="btn-outline" style={{ padding: '14px 36px', fontSize: '1.05rem', textDecoration: 'none', minWidth: '200px', textAlign: 'center', background: '#fff' }}>
                  Download Brochure
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ── Section 2: Overlapping Metrics Bar ── */}
        <section style={{ position: 'relative', zIndex: 12 }}>
          <div className="container">
            <div className="cd-overlay-stats-bar">
              <div className="cd-overlay-stat-pill pill-primary">
                <div className="cd-overlay-stat-title">Affiliation & Status</div>
                <div className="cd-overlay-stat-value">{college.affiliation || 'Anna University Approved'}</div>
              </div>
              <div className="cd-overlay-stat-pill pill-secondary">
                <div className="cd-overlay-stat-title">Established Year</div>
                <div className="cd-overlay-stat-value">Estd. {college.established || '2008'}</div>
              </div>
              <div className="cd-overlay-stat-pill pill-accent">
                <div className="cd-overlay-stat-title">Intake & Seats</div>
                <div className="cd-overlay-stat-value">{college.rating ? `${college.rating} Star Rank` : '600+ Annual Seats'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: About description & statistics splits ── */}
        <section style={{ padding: '60px 0' }}>
          <div className="container">
            <div className="cd-about-split-row">

              {/* Left Column: About content paragraphs */}
              <div>
                <div className="section-label-premium" style={{ display: 'inline-flex' }}>
                  <span className="label-dot" /> About Institution
                </div>
                <h2 className="section-title-premium" style={{ margin: '8px 0 20px', textAlign: 'left' }}>
                  Overview of <span className="title-highlight">Campus Standards</span>
                </h2>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                  This institution is known for its academic rigor, experienced faculty panels, and consistent record in state rankings. Providing an environment filled with modern resources, the campus focuses heavily on student innovations, technical club initiatives, and core engineering or medical disciplines.
                </p>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '28px' }}>
                  Collaborating with top-tier research institutes, the college promotes guest seminars, hands-on internships, and career workshops to ensure that student profiles are fully aligned with the requirements of major multinational recruitment campaigns.
                </p>


              </div>

              {/* Right Column: Placement / Alumni Metrics panel */}
              <div className="cd-metrics-vertical">
                <div className="cd-metric-item">
                  <div className="cd-metric-num">98%</div>
                  <div className="cd-metric-txt">Average Placement Rate</div>
                </div>
                <div className="cd-metric-item">
                  <div className="cd-metric-num">200+</div>
                  <div className="cd-metric-txt">Corporate Recruiters</div>
                </div>
                <div className="cd-metric-item">
                  <div className="cd-metric-num">10K+</div>
                  <div className="cd-metric-txt">Global Alumni Network</div>
                </div>
                <div className="cd-metric-item">
                  <div className="cd-metric-num">44 LPA</div>
                  <div className="cd-metric-txt">Highest Salary Package</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Section 4: Why Choose Us (2x2 Facilities Grid) ── */}
        <section style={{ padding: '60px 0' }}>
          <div className="container">
            <div className="page-detail-grid">

              {/* Left Column: Visual description */}
              <div>
                <div className="section-label-premium" style={{ display: 'inline-flex' }}>
                  <span className="label-dot" /> Institutional Perks
                </div>
                <h2 className="section-title-premium" style={{ margin: '8px 0 20px', textAlign: 'left' }}>
                  Why Choose <span className="title-highlight">This Campus</span>
                </h2>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                  Excellent infrastructure paired with a strong focus on self-reliance. This campus is designed to give students everything they need for their academic pursuits as well as their recreational activities.
                </p>
                <img
                  src={fallbackImg}
                  alt="Campus perks"
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '20px', border: '1px solid var(--border)' }}
                />
              </div>

              {/* Right Column: 2x2 grid of facilities cards */}
              <div className="cd-facilities-grid">
                <div className="cd-facility-card">
                  <div className="cd-facility-icon">📚</div>
                  <h4 className="cd-facility-title">Digital Library</h4>
                  <p className="cd-facility-desc">Access to thousands of international research papers, journals, and technical ebooks 24/7.</p>
                </div>
                <div className="cd-facility-card">
                  <div className="cd-facility-icon">🔬</div>
                  <h4 className="cd-facility-title">Research Labs</h4>
                  <p className="cd-facility-desc">State-of-the-art laboratory infrastructure equipped with the latest instrumentation machinery.</p>
                </div>
                <div className="cd-facility-card">
                  <div className="cd-facility-icon">🏠</div>
                  <h4 className="cd-facility-title">Cozy Hostels</h4>
                  <p className="cd-facility-desc">Secure on-campus residential housing with student lounges and fully catered student dining halls.</p>
                </div>
                <div className="cd-facility-card">
                  <div className="cd-facility-icon">🏋️</div>
                  <h4 className="cd-facility-title">Sports Arena</h4>
                  <p className="cd-facility-desc">Outdoor football/cricket fields, courts, and fully equipped indoor physical workout centers.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Section 5: Courses Offered (Replaces Admission Process) ── */}
        {courses.length > 0 && (
          <section style={{ padding: '60px 0', background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div className="container">
              <div className="section-header-centered" style={{ marginBottom: '50px' }}>
                <div className="section-label-premium" style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  <span className="label-dot" /> Academic Portfolio
                </div>
                <h2 className="section-title-premium" style={{ margin: '8px 0 0' }}>
                  Programs & <span className="title-highlight">Courses Offered</span>
                </h2>
                <p className="section-subtitle-premium" style={{ margin: '12px auto 0', maxWidth: '500px' }}>
                  Explore the certified undergraduate, postgraduate, and diploma streams available at this campus.
                </p>
              </div>

              <div className="cd-categories-grid-site">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                  {leftColCategories.map(renderCategoryCard)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                  {rightColCategories.map(renderCategoryCard)}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Section 6: Bottom CTA footer banner ── */}
        <section>
          <div className="container">
            <div className="cd-cta-footer-banner">
              <h3 className="cd-cta-title">Interested in {college.short_name || 'this institution'}?</h3>
              <p className="cd-cta-desc">
                Request callback counseling regarding fee waivers, course details, trust scholarship guidelines, and seats list.
              </p>
              <div className="cd-cta-btn-group">
                <Link to="/apply" state={{ college }} className="btn-primary" style={{ background: '#fff', color: 'var(--blue)', padding: '12px 32px' }}>
                  Apply For Admission
                </Link>
                <a href="tel:+919843139330" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', padding: '12px 32px', textDecoration: 'none' }}>
                  📞 Call Counselor
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
