import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchColleges } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import collegesHero1 from '../assets/colleges_hero_1.jpg';
import collegesHero2 from '../assets/colleges_hero_2.jpg';
import collegesHero3 from '../assets/colleges_hero_3.jpg';
import collegesHero4 from '../assets/colleges_hero_4.jpg';
import collegesHero5 from '../assets/colleges_hero_5.jpg';

const COURSE_FILTERS = [
  { id: 'engineering', label: 'Engineering & Technology' },
  { id: 'medical',     label: 'Medical / MBBS' },
  { id: 'nursing',     label: 'Nursing' },
  { id: 'allied',      label: 'Allied Health' },
  { id: 'arts',        label: 'Arts & Science' },
  { id: 'management',  label: 'Management / MBA' },
  { id: 'law',         label: 'Law' },
  { id: 'pharmacy',    label: 'Pharmacy' },
  { id: 'agriculture', label: 'Agricultural Science' },
];

const AFFILIATION_FILTERS = [
  { id: 'anna',  label: 'Anna University' },
  { id: 'mgr',   label: 'Dr. MGR Medical University' },
  { id: 'bharat',label: 'Bharathidasan University' },
  { id: 'mother',label: 'Mother Teresa University' },
  { id: 'other', label: 'Other Universities' },
];

const TYPE_FILTERS = [
  { id: 'autonomous',  label: 'Autonomous' },
  { id: 'affiliated',  label: 'Affiliated' },
  { id: 'government',  label: 'Government Aided' },
  { id: 'private',     label: 'Private Unaided' },
];

const LOCATION_FILTERS = [
  { id: 'chennai',     label: 'Chennai' },
  { id: 'coimbatore',  label: 'Coimbatore' },
  { id: 'madurai',     label: 'Madurai' },
  { id: 'trichy',      label: 'Trichy' },
  { id: 'salem',       label: 'Salem' },
  { id: 'perambalur',  label: 'Perambalur' },
];

const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`filter-group${open ? ' open' : ''}`} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
      <button className="filter-group-toggle" onClick={() => setOpen(v => !v)} style={{ display: 'flex', width: '100%', justifyContent: 'space-between', background: 'none', border: 'none', fontWeight: 800, color: 'var(--text-primary)', cursor: 'pointer', padding: '8px 0' }}>
        {title}
        <span className="filter-group-chevron" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}><ChevronIcon /></span>
      </button>
      {open && <div className="filter-group-body" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{children}</div>}
    </div>
  );
}

export default function Colleges() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [colleges, setColleges]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy]           = useState('default');

  const [selectedCourses,       setSelectedCourses]       = useState([]);
  const [selectedAffiliations,  setSelectedAffiliations]  = useState([]);
  const [selectedTypes,         setSelectedTypes]         = useState([]);
  const [selectedLocations,     setSelectedLocations]     = useState([]);
  const [locationSearch,        setLocationSearch]        = useState('');

  const defaultImages = [
    collegesHero1,
    collegesHero2,
    collegesHero3,
    collegesHero4,
    collegesHero5
  ];

  const collageImages = Array.from({ length: 5 }).map((_, idx) => {
    const c = colleges[idx];
    return (
      c?.primary_image_url ||
      c?.primary_image ||
      c?.banner_image_url ||
      c?.banner_image ||
      c?.college_images?.[0] ||
      defaultImages[idx]
    );
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchColleges();
        setColleges(Array.isArray(data) ? data : data.results || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  const toggle = (arr, setArr, id) =>
    setArr(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const courseLabel = id => COURSE_FILTERS.find(f => f.id === id)?.label || id;
  const affLabel    = id => AFFILIATION_FILTERS.find(f => f.id === id)?.label || id;
  const typeLabel   = id => TYPE_FILTERS.find(f => f.id === id)?.label || id;
  const locLabel    = id => LOCATION_FILTERS.find(f => f.id === id)?.label || id;

  const activeCount = selectedCourses.length + selectedAffiliations.length +
                      selectedTypes.length + selectedLocations.length;

  const clearAll = () => {
    setSelectedCourses([]);
    setSelectedAffiliations([]);
    setSelectedTypes([]);
    setSelectedLocations([]);
    setSearch('');
  };

  const filtered = colleges
    .filter(c => {
      const name    = (c.college_name || c.name || '').toLowerCase();
      const city    = (c.location_city || '').toLowerCase();
      const coursesArr = c.courses_offered_display || c.courses_offered || [];
      const courses = Array.isArray(coursesArr) ? coursesArr.map(x => String(x).toLowerCase()) : [];
      const affil   = (c.university_affiliation || '').toLowerCase();
      const type    = (c.college_type || '').toLowerCase();

      if (search && !name.includes(search.toLowerCase()) && !city.includes(search.toLowerCase())) return false;

      if (selectedCourses.length > 0) {
        const ok = selectedCourses.some(f =>
          courses.some(co => co.includes(f.replace('allied', 'health')))
        );
        if (!ok) return false;
      }
      if (selectedAffiliations.length > 0) {
        const ok = selectedAffiliations.some(f => affil.includes(f));
        if (!ok) return false;
      }
      if (selectedTypes.length > 0) {
        const ok = selectedTypes.some(f => type.includes(f));
        if (!ok) return false;
      }
      if (selectedLocations.length > 0) {
        const ok = selectedLocations.some(f => city.includes(f));
        if (!ok) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc')  return (a.college_name || a.name || '').localeCompare(b.college_name || b.name || '');
      if (sortBy === 'name-desc') return (b.college_name || b.name || '').localeCompare(a.college_name || a.name || '');
      return 0;
    });

  const Sidebar = (
    <>
      {sidebarOpen && (
        <div className="filter-aside-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`filter-aside${sidebarOpen ? ' open' : ''}`} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '24px', padding: '24px', position: 'sticky', top: '100px', height: 'fit-content' }}>
        <div className="filter-aside-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <span className="filter-aside-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
            <FilterIcon /> Filters
            {activeCount > 0 && (
              <span style={{ background: 'var(--blue)', color: '#fff', borderRadius: '50px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 800 }}>
                {activeCount}
              </span>
            )}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {activeCount > 0 && (
              <button className="filter-clear-btn" onClick={clearAll} style={{ border: 'none', background: 'none', color: 'var(--blue)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Clear all</button>
            )}
            <button className="filter-mobile-close" onClick={() => setSidebarOpen(false)} style={{ border: 'none', background: 'none', color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer', display: 'none' }}>
              <CloseIcon /> Close
            </button>
          </div>
        </div>

        <div className="filter-aside-body">
          {/* Course streams */}
          <FilterGroup title="Academic Stream">
            {COURSE_FILTERS.map(f => (
              <label key={f.id} className={`filter-checkbox-tag${selectedCourses.includes(f.id) ? ' active' : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(f.id)}
                  onChange={() => toggle(selectedCourses, setSelectedCourses, f.id)}
                />
                {f.label}
              </label>
            ))}
          </FilterGroup>

          {/* Location */}
          <FilterGroup title="Location / Cities">
            <div style={{ width: '100%', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Search city…"
                value={locationSearch}
                onChange={e => setLocationSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.84rem', outline: 'none' }}
              />
            </div>
            {LOCATION_FILTERS.filter(f =>
              !locationSearch || f.label.toLowerCase().includes(locationSearch.toLowerCase())
            ).map(f => (
              <label key={f.id} className={`filter-checkbox-tag${selectedLocations.includes(f.id) ? ' active' : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(f.id)}
                  onChange={() => toggle(selectedLocations, setSelectedLocations, f.id)}
                />
                📍 {f.label}
              </label>
            ))}
          </FilterGroup>

          {/* Affiliation */}
          <FilterGroup title="University Affiliation" defaultOpen={false}>
            {AFFILIATION_FILTERS.map(f => (
              <label key={f.id} className={`filter-checkbox-tag${selectedAffiliations.includes(f.id) ? ' active' : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedAffiliations.includes(f.id)}
                  onChange={() => toggle(selectedAffiliations, setSelectedAffiliations, f.id)}
                />
                🎓 {f.label}
              </label>
            ))}
          </FilterGroup>

          {/* College Type */}
          <FilterGroup title="College Status" defaultOpen={false}>
            {TYPE_FILTERS.map(f => (
              <label key={f.id} className={`filter-checkbox-tag${selectedTypes.includes(f.id) ? ' active' : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(f.id)}
                  onChange={() => toggle(selectedTypes, setSelectedTypes, f.id)}
                />
                ⚡ {f.label}
              </label>
            ))}
          </FilterGroup>
        </div>
      </aside>
    </>
  );

  return (
    <PageTransition>
      <div className="colleges-page-premium" style={{ background: '#fcfcfc', paddingBottom: '80px' }}>

        {/* ── Section 1: Hero Header ── */}
        <section className="colleges-hero" style={{ padding: '130px 0 60px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
          <div className="hero-bg-pattern" />
          <div className="container">
            <div className="page-hero-grid">
              
              {/* Left Column: Heading & Highlights */}
              <div style={{ textAlign: 'left' }}>
                <div className="section-label-premium" style={{ display: 'inline-flex' }}>
                  <span className="label-dot" /> Verified Network
                </div>
                <h1 className="section-title-premium" style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.25, margin: '14px 0 20px', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '-0.5px' }}>
                  Our Branch <br />
                  <span className="title-highlight">Colleges</span>
                </h1>
                <p className="section-subtitle-premium" style={{ margin: '0 0 24px', maxWidth: '500px', fontSize: '1.05rem', lineHeight: 1.68, textAlign: 'left' }}>
                  Explore and select from our vetted network of top-ranked engineering and medical colleges across Tamil Nadu, offering verified seats list.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '24px' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '10px 18px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '110px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--blue)' }}>{colleges.length || '15+'}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Colleges</span>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '10px 18px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '110px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16a34a' }}>6+</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Streams</span>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '10px 18px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '110px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b' }}>100%</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Column: College Images Collage */}
              <div className="hero-collage-container" style={{ width: '100%' }}>
                <div className="collage-grid">
                  {collageImages.map((imgUrl, index) => (
                    <div key={index} className={`collage-item item-${index + 1}`}>
                      <img
                        src={imgUrl}
                        alt={`College Branch ${index + 1}`}
                        className="collage-img"
                        onError={e => {
                          e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Section 2: Search Toolbar ── */}
        <section style={{ padding: '36px 0 0' }}>
          <div className="container">
            <div className="search-row-glass">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                className="search-input-premium"
                type="text"
                placeholder="Search institutional name, streams, or city location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                className="filter-mobile-toggle btn-outline"
                onClick={() => setSidebarOpen(true)}
                style={{ display: 'none', padding: '6px 14px', fontSize: '0.8rem', gap: '6px', alignItems: 'center' }}
              >
                <FilterIcon /> Filters {activeCount > 0 && `(${activeCount})`}
              </button>
            </div>
          </div>
        </section>

        {/* ── Section 3: Sidebar + Grid layout ── */}
        <section style={{ padding: '40px 0' }}>
          <div className="container">
            <div className="page-content-grid">
              
              {/* Sidebar filter options */}
              {Sidebar}

              {/* Grid content columns */}
              <div>
                {/* Active chips list */}
                {activeCount > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {selectedCourses.map(id => (
                      <div key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--blue-pale)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 700 }}>
                        {courseLabel(id)}
                        <button onClick={() => toggle(selectedCourses, setSelectedCourses, id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--blue)', fontWeight: 800 }}>✕</button>
                      </div>
                    ))}
                    {selectedLocations.map(id => (
                      <div key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--blue-pale)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 700 }}>
                        📍 {locLabel(id)}
                        <button onClick={() => toggle(selectedLocations, setSelectedLocations, id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--blue)', fontWeight: 800 }}>✕</button>
                      </div>
                    ))}
                    {selectedAffiliations.map(id => (
                      <div key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--blue-pale)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 700 }}>
                        🏛 {affLabel(id)}
                        <button onClick={() => toggle(selectedAffiliations, setSelectedAffiliations, id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--blue)', fontWeight: 800 }}>✕</button>
                      </div>
                    ))}
                    {selectedTypes.map(id => (
                      <div key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--blue-pale)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 700 }}>
                        {typeLabel(id)}
                        <button onClick={() => toggle(selectedTypes, setSelectedTypes, id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--blue)', fontWeight: 800 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grid header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>
                    {loading ? 'Analyzing...' : <>Found <strong>{filtered.length}</strong> college institutions</>}
                  </p>
                  <select
                    className="sort-select-premium"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="default">Default Sort</option>
                    <option value="name-asc">Name: Alphabetical A-Z</option>
                    <option value="name-desc">Name: Alphabetical Z-A</option>
                  </select>
                </div>

                {/* Institutional Grid */}
                {loading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <div key={n} className="skeleton-card" style={{ height: '320px', borderRadius: '24px' }} />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '24px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>🏛️</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>No College Branch Match</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Try search adjusting or clearing the filters.</p>
                    <button className="btn-primary" onClick={clearAll}>Clear Filters</button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                    {filtered.map((c, i) => {
                      const id    = c.college_id || c.id;
                      const cName = c.college_name || c.name || 'College';
                      const slug  = c.short_name || id;
                      const city  = c.location_city || '';
                      const state = c.location_state || 'Tamil Nadu';
                      const img   = c.primary_image_url || c.primary_image || c.banner_image_url || c.banner_image || c.college_images?.[0] || collegesHero3;
                      const branchesArr = c.courses_offered_display || c.courses_offered || [];
                      const branches = Array.isArray(branchesArr) ? branchesArr : [];

                      return (
                        <div key={id || i} className="college-card-premium card-3d">
                          
                          {/* Image Wrap */}
                          <div className="college-card-image-wrap">
                            <img
                              src={img}
                              alt={cName}
                              onError={e => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80';
                              }}
                            />
                            <span style={{ position: 'absolute', top: '14px', left: '14px', background: 'var(--white)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {c.short_name || 'MET'}
                            </span>
                          </div>

                          {/* Body Content */}
                          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                            <div>
                              <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px', lineBreak: 'anywhere' }}>{cName}</h3>
                              {city && (
                                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 14px', fontWeight: 600 }}>
                                  📍 {city}, {state}
                                </p>
                              )}
                              {branches.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                                  {branches.slice(0, 2).map((br, j) => (
                                    <span key={j} style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '50px', fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{br}</span>
                                  ))}
                                  {branches.length > 2 && (
                                    <span style={{ background: 'var(--blue-pale)', border: '1px solid var(--blue-muted)', padding: '2px 8px', borderRadius: '50px', fontSize: '0.68rem', color: 'var(--blue)', fontWeight: 700 }}>+{branches.length - 2} More</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions Group */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                              <Link to={`/colleges/${slug}`} className="btn-dark btn-sm" style={{ flexGrow: 1, textAlign: 'center', padding: '8px 12px', fontSize: '0.78rem' }}>
                                Details
                              </Link>
                              <Link to="/apply" state={{ college: c }} className="btn-secondary btn-sm" style={{ flexGrow: 1, textAlign: 'center', padding: '8px 12px', fontSize: '0.78rem' }}>
                                Apply
                              </Link>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
