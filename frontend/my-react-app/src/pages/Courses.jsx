import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchCourses, groupCoursesByName, getCourseImage } from '../services/api';
import PageTransition from '../components/common/PageTransition';

import coursesHero1 from '../assets/courses_hero_1.jpg';
import coursesHero2 from '../assets/courses_hero_2.jpg';
import coursesHero3 from '../assets/courses_hero_3.jpg';
import coursesHero4 from '../assets/courses_hero_4.jpg';
import coursesHero5 from '../assets/courses_hero_5.jpg';

import catEngineering from '../assets/categories/cat_engineering.jpg';
import catPolytechnic from '../assets/categories/cat_polytechnic.jpg';
import catComputerApplications from '../assets/categories/cat_computer_applications.jpg';
import catMedical from '../assets/categories/cat_medical.jpg';
import catNursing from '../assets/categories/cat_nursing.jpg';
import catAlliedHealth from '../assets/categories/cat_allied_health.jpg';
import catPhysiotherapy from '../assets/categories/cat_physiotherapy.jpg';
import catOccupationalTherapy from '../assets/categories/cat_occupational_therapy.jpg';
import catArtsScience from '../assets/categories/cat_arts_science.jpg';
import catManagement from '../assets/categories/cat_management.jpg';
import catPharmacy from '../assets/categories/cat_pharmacy.jpg';
import catLaw from '../assets/categories/cat_law.jpg';
import catArchitecture from '../assets/categories/cat_architecture.jpg';
import catPhysicalEducation from '../assets/categories/cat_physical_education.jpg';
import catAgriculture from '../assets/cat_agriculture.jpg';
import catDefault from '../assets/cat_default.jpg';
import {
  FaCogs, FaStethoscope, FaUserNurse, FaHeartbeat,
  FaBook, FaBriefcase, FaBalanceScale, FaDraftingCompass,
  FaPills, FaTools, FaAtom, FaUniversity, FaSeedling
} from 'react-icons/fa';

const getCourseIcon = (title, category) => {
  const t = (title || '').toLowerCase();
  const cat = (category || '').toLowerCase();

  if (t.includes('mbbs') || cat === 'medical') {
    return <FaStethoscope size={18} />;
  }
  if (t.includes('nursing') || cat === 'nursing') {
    return <FaUserNurse size={18} />;
  }
  if (cat.includes('allied') || cat.includes('health') || t.includes('allied')) {
    return <FaHeartbeat size={18} />;
  }
  if (cat.includes('pharmacy') || t.includes('pharmacy') || t.includes('pharm')) {
    return <FaPills size={18} />;
  }
  if (t.includes('mba') || t.includes('mca') || cat === 'management') {
    return <FaBriefcase size={18} />;
  }
  if (t.includes('law') || cat === 'law' || t.includes('llb')) {
    return <FaBalanceScale size={18} />;
  }
  if (t.includes('architecture') || cat === 'architecture' || t.includes('arch')) {
    return <FaDraftingCompass size={18} />;
  }
  if (t.includes('polytechnic') || t.includes('diploma')) {
    return <FaTools size={18} />;
  }
  if (t.includes('m.tech') || t.includes('m.e') || t.includes('research')) {
    return <FaAtom size={18} />;
  }
  if (t.includes('engineering') || cat === 'engineering') {
    return <FaCogs size={18} />;
  }
  if (t.includes('m.sc') || t.includes('m.a') || t.includes('m.com') || t.includes('postgraduate')) {
    return <FaUniversity size={18} />;
  }
  if (cat.includes('arts') || cat.includes('science') || t.includes('arts') || t.includes('science')) {
    return <FaBook size={18} />;
  }
  if (cat.includes('agriculture') || cat.includes('agricultural') || t.includes('agriculture')) {
    return <FaSeedling size={18} />;
  }
  return <FaUniversity size={18} />;
};



const DEFAULT_COURSES = [
  { id: 1, title: 'Engineering (B.E / B.Tech)', category: 'Engineering & Technology', level: 'Undergraduate', duration: '4 Years', students: 450, rating: 4.8, image: catEngineering, description: 'CS, ECE, Mechanical, Civil, EEE and more at Anna University affiliates.' },
  { id: 2, title: 'Medical (MBBS)', category: 'Medical', level: 'Undergraduate', duration: '5.5 Years', students: 200, rating: 4.9, image: catMedical, description: 'MBBS, BDS programs at MCI/NMC-recognised institutions across Tamil Nadu.' },
  { id: 3, title: 'Nursing (B.Sc)', category: 'Nursing', level: 'Undergraduate', duration: '4 Years', students: 300, rating: 4.7, image: catNursing, description: 'B.Sc Nursing and P.B.B.Sc Nursing with strong clinical training.' },
  { id: 4, title: 'Allied Health Sciences', category: 'Allied Health Science', level: 'Undergraduate', duration: '3 Years', students: 250, rating: 4.6, image: catAlliedHealth, description: 'Physiotherapy, Lab Tech, Radiology, Optometry and more.' },
  { id: 5, title: 'Arts & Science (BA/BSc/BCom)', category: 'Arts & Science', level: 'Undergraduate', duration: '3 Years', students: 380, rating: 4.5, image: catArtsScience, description: 'Humanities, Sciences, and Commerce undergraduate programs.' },
  { id: 6, title: 'MBA / MCA', category: 'Management', level: 'Postgraduate', duration: '2 Years', students: 280, rating: 4.7, image: catManagement, description: 'MBA & MCA from AICTE-approved institutes with industry exposure.' },
  { id: 7, title: 'Law (LLB)', category: 'Law', level: 'Undergraduate', duration: '3–5 Years', students: 150, rating: 4.6, image: catLaw, description: '3-Year LLB and 5-Year integrated BA LLB at BCI-affiliated colleges.' },
  { id: 8, title: 'Architecture (B.Arch)', category: 'Architecture', level: 'Undergraduate', duration: '5 Years', students: 100, rating: 4.7, image: catArchitecture, description: 'Bachelor of Architecture with COA recognition and studio practice.' },
  { id: 9, title: 'Pharmacy (B.Pharm / D.Pharm)', category: 'Pharmacy', level: 'Undergraduate', duration: '2–4 Years', students: 180, rating: 4.6, image: catPharmacy, description: 'B.Pharm and D.Pharm with strong clinical and industry placement.' },
  { id: 10, title: 'Polytechnic / Diploma', category: 'Engineering & Technology', level: 'Diploma', duration: '3 Years', students: 320, rating: 4.4, image: catPolytechnic, description: 'Practical Diploma in Engineering — job-ready in 3 years.' },
  { id: 11, title: 'M.Tech / M.E', category: 'Engineering & Technology', level: 'Postgraduate', duration: '2 Years', students: 120, rating: 4.6, image: catEngineering, description: 'Postgraduate Engineering programs with specialised research focus.' },
  { id: 12, title: 'M.Sc / M.A / M.Com', category: 'Arts & Science', level: 'Postgraduate', duration: '2 Years', students: 160, rating: 4.4, image: catArtsScience, description: 'Postgraduate programs in Sciences, Arts, and Commerce disciplines.' },
  { id: 13, title: 'BCA / MCA', category: 'Computer Applications', level: 'Undergraduate', duration: '3 Years', students: 200, rating: 4.5, image: catComputerApplications, description: 'Bachelor & Master of Computer Applications with strong IT placement.' },
  { id: 14, title: 'Physiotherapy (BPT)', category: 'Allied Health Science', level: 'Undergraduate', duration: '4.5 Years', students: 140, rating: 4.6, image: catPhysiotherapy, description: 'Bachelor of Physiotherapy with hands-on clinical internship.' },
  { id: 15, title: 'Occupational Therapy', category: 'Allied Health Science', level: 'Undergraduate', duration: '4.5 Years', students: 90, rating: 4.5, image: catOccupationalTherapy, description: 'BOT program focusing on rehabilitation and patient independence.' },
  { id: 16, title: 'Physical Education (B.P.Ed)', category: 'Education', level: 'Undergraduate', duration: '2 Years', students: 110, rating: 4.4, image: catPhysicalEducation, description: 'Bachelor of Physical Education — sports science and coaching.' },
];

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
const LEVELS = ['Undergraduate', 'Postgraduate', 'Diploma'];
const DURATIONS = ['2 Years', '3 Years', '4 Years', '5 Years', '5+ Years'];
const RATINGS = [4, 3];

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
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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

function Stars({ rating }) {
  return (
    <span className="stars-display" style={{ color: '#f59e0b', fontSize: '0.8rem' }}>
      {'★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

export default function Courses() {
  const { data: courses = [], isLoading: loading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        const response = await fetchCourses();
        const data = Array.isArray(response) ? response : response.results || [];
        const rawList = data.length > 0 ? data : DEFAULT_COURSES;
        return groupCoursesByName(rawList);
      } catch {
        return groupCoursesByName(DEFAULT_COURSES);
      }
    },
  });
  
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const [selCategories, setSelCategories] = useState([]);
  const [selLevels, setSelLevels] = useState([]);
  const [selDurations, setSelDurations] = useState([]);
  const [minRating, setMinRating] = useState(0);

  const defaultImages = [
    coursesHero1,
    coursesHero2,
    coursesHero3,
    coursesHero4,
    coursesHero5
  ];

  const collageImages = Array.from({ length: 5 }).map((_, idx) => {
    const c = courses[idx];
    return (
      c?.image_url ||
      c?.image ||
      defaultImages[idx]
    );
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggle = (arr, setArr, id) =>
    setArr(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const activeCount =
    selCategories.length + selLevels.length + selDurations.length + (minRating > 0 ? 1 : 0);

  const clearAll = () => {
    setSelCategories([]); setSelLevels([]); setSelDurations([]);
    setMinRating(0); setSearch('');
  };

  const courseLabel = id => COURSE_FILTERS.find(f => f.id === id)?.label || id;

  const getStreamClass = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('engineering')) return 'stream-engineering';
    if (cat.includes('medical')) return 'stream-medical';
    if (cat.includes('nursing')) return 'stream-nursing';
    if (cat.includes('allied') || cat.includes('health')) return 'stream-allied';
    if (cat.includes('management') || cat.includes('mba')) return 'stream-management';
    if (cat.includes('pharmacy')) return 'stream-pharmacy';
    if (cat.includes('arts') || cat.includes('science')) return 'stream-arts';
    if (cat.includes('agriculture') || cat.includes('agricultural')) return 'stream-agriculture';
    return 'stream-default';
  };

  const filtered = courses
    .filter(c => {
      const title = (c.title || c.name || '').toLowerCase();
      const category = (c.category_display || c.category || '').toLowerCase();
      const level = (c.level || c.degree_type_display || '').toLowerCase();
      const duration = (c.duration || '');
      const rating = parseFloat(c.rating || 0);

      if (search && !title.includes(search.toLowerCase())) return false;
      if (selCategories.length > 0 && !selCategories.some(f => {
        if (f === 'agriculture') return category.includes('agricultur');
        return category.includes(f.toLowerCase());
      })) return false;
      if (selLevels.length > 0 && !selLevels.some(f => level.includes(f.toLowerCase()))) return false;
      if (selDurations.length > 0 && !selDurations.some(f => duration.includes(f.replace(' Years', '')))) return false;
      if (minRating > 0 && rating < minRating) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return (a.title || a.name || '').localeCompare(b.title || b.name || '');
      if (sortBy === 'name-desc') return (b.title || b.name || '').localeCompare(a.title || a.name || '');
      if (sortBy === 'rating-desc') return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      if (sortBy === 'students-desc') return (parseInt(b.students) || 0) - (parseInt(a.students) || 0);
      return 0;
    });

  const coursesByCategory = {};
  filtered.forEach(course => {
    const cat = course.category_display || course.category || 'Other';
    if (!coursesByCategory[cat]) {
      coursesByCategory[cat] = [];
    }
    coursesByCategory[cat].push(course);
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
          <div style={{ display: 'flex', gap: 6 }}>
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
              <label key={f.id} className={`filter-checkbox-tag${selCategories.includes(f.id) ? ' active' : ''}`}>
                <input
                  type="checkbox"
                  checked={selCategories.includes(f.id)}
                  onChange={() => toggle(selCategories, setSelCategories, f.id)}
                />
                {f.label}
              </label>
            ))}
          </FilterGroup>

          {/* Level */}
          <FilterGroup title="Program Level">
            {LEVELS.map(lv => (
              <label key={lv} className={`filter-checkbox-tag${selLevels.includes(lv) ? ' active' : ''}`}>
                <input
                  type="checkbox"
                  checked={selLevels.includes(lv)}
                  onChange={() => toggle(selLevels, setSelLevels, lv)}
                />
                ⚡ {lv}
              </label>
            ))}
          </FilterGroup>

          {/* Duration */}
          <FilterGroup title="Duration" defaultOpen={false}>
            {DURATIONS.map(dur => (
              <label key={dur} className={`filter-checkbox-tag${selDurations.includes(dur) ? ' active' : ''}`}>
                <input
                  type="checkbox"
                  checked={selDurations.includes(dur)}
                  onChange={() => toggle(selDurations, setSelDurations, dur)}
                />
                ⏱ {dur}
              </label>
            ))}
          </FilterGroup>

          {/* Minimum Rating */}
          <FilterGroup title="Minimum Rating" defaultOpen={false}>
            <div style={{ width: '100%', padding: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span>Minimum score:</span>
                <strong style={{ color: 'var(--blue)' }}>{minRating > 0 ? `${minRating}+ ★` : 'All'}</strong>
              </div>
              <input
                type="range"
                min="0" max="5" step="0.5"
                value={minRating}
                onChange={e => setMinRating(parseFloat(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', height: '6px', borderRadius: '4px', background: 'var(--border)', outline: 'none' }}
              />
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {RATINGS.map(r => (
                  <label key={r} className={`filter-checkbox-tag${minRating === r ? ' active' : ''}`} style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <input
                      type="checkbox"
                      checked={minRating === r}
                      onChange={() => setMinRating(minRating === r ? 0 : r)}
                    />
                    <span style={{ display: 'flex', gap: '4px' }}><Stars rating={r} /> &amp; above</span>
                  </label>
                ))}
              </div>
            </div>
          </FilterGroup>
        </div>
      </aside>
    </>
  );

  return (
    <PageTransition>
      <div className="courses-page-premium" style={{ background: '#fcfcfc', paddingBottom: '80px' }}>

        {/* ── Section 1: Hero Header ── */}
        <section className="colleges-hero" style={{ padding: '130px 0 60px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
          <div className="hero-bg-pattern" />
          <div className="container">
            <div className="page-hero-grid">

              {/* Left Column: Heading & Highlights */}
              <div style={{ textAlign: 'left' }}>
                <div className="section-label-premium" style={{ display: 'inline-flex' }}>
                  <span className="label-dot" /> Verified Curriculums
                </div>
                <h1 className="section-title-premium" style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.25, margin: '14px 0 20px', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '-0.5px' }}>
                  Courses &amp; <br />
                  <span className="title-highlight">Programs</span>
                </h1>
                <p className="section-subtitle-premium" style={{ margin: '0 0 24px', maxWidth: '500px', fontSize: '1.05rem', lineHeight: 1.68, textAlign: 'left' }}>
                  Browse through professional undergraduate, postgraduate, and diploma streams with comprehensive seat mappings and trust waiver aid.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '24px' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '10px 18px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '110px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--blue)' }}>{courses.length || '12+'}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Programs</span>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '10px 18px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '110px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16a34a' }}>3 Levels</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>UG, PG, Dip</span>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '10px 18px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '110px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b' }}>4.8 ★</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Rating</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Course Images Collage */}
              <div className="hero-collage-container" style={{ width: '100%' }}>
                <div className="collage-grid">
                  {collageImages.map((imgUrl, index) => (
                    <div key={index} className={`collage-item item-${index + 1}`}>
                      <img
                        src={imgUrl}
                        alt={`Course Stream ${index + 1}`}
                        className="collage-img"
                        onError={e => {
                          e.target.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80';
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
                placeholder="Search by course stream name, specialization, or curriculum title…"
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

              {/* Sidebar Filters */}
              {Sidebar}

              {/* Grid content columns */}
              <div>
                {/* Active chips list */}
                {activeCount > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {selCategories.map(c => (
                      <div key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--blue-pale)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 700 }}>
                        {courseLabel(c)}
                        <button onClick={() => toggle(selCategories, setSelCategories, c)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--blue)', fontWeight: 800 }}>✕</button>
                      </div>
                    ))}
                    {selLevels.map(l => (
                      <div key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--blue-pale)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 700 }}>
                        {l}
                        <button onClick={() => toggle(selLevels, setSelLevels, l)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--blue)', fontWeight: 800 }}>✕</button>
                      </div>
                    ))}
                    {selDurations.map(d => (
                      <div key={d} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--blue-pale)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 700 }}>
                        ⏱ {d}
                        <button onClick={() => toggle(selDurations, setSelDurations, d)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--blue)', fontWeight: 800 }}>✕</button>
                      </div>
                    ))}
                    {minRating > 0 && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--blue-pale)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 700 }}>
                        ⭐ {minRating}+ Ratings
                        <button onClick={() => setMinRating(0)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--blue)', fontWeight: 800 }}>✕</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Grid header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>
                    {loading ? 'Analyzing...' : <>Found <strong>{filtered.length}</strong> specialty programs</>}
                  </p>
                  <select
                    className="sort-select-premium"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="default">Default Sort</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="name-desc">Name: Z → A</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="students-desc">Most Popular</option>
                  </select>
                </div>

                {/* Courses Grid */}
                {loading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <div key={n} className="skeleton-card" style={{ height: '280px', borderRadius: '24px' }} />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '24px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>📚</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>No Course Streams Found</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Try adjusting your search criteria or clearing filters.</p>
                    <button className="btn-primary" onClick={clearAll}>Clear Filters</button>
                  </div>
                ) : (
                  <div>
                    {Object.keys(coursesByCategory).map((catName) => (
                      <div key={catName} style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', borderBottom: '2px solid var(--blue-pale)', paddingBottom: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                          <span style={{ background: 'var(--blue)', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }} /> {catName}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                          {coursesByCategory[catName].map((course, i) => (
                            <div key={course.id || i} className={`course-card-premium card-3d ${getStreamClass(course.category_display || course.category)}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', background: '#fff', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden', justifyContent: 'space-between' }}>

                              {/* 1. Image on top */}
                              <div className="course-card-image-wrap" style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden', background: 'var(--bg-soft)' }}>
                                <img
                                  src={
                                    course.image_url || course.image ||
                                    getCourseImage(course.course_name || course.title || course.name, course.category_display || course.category)
                                  }
                                  alt={course.course_name || course.title || course.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                                  className="course-card-img"
                                  onError={e => {
                                    e.target.src = catDefault;
                                  }}
                                />
                              </div>

                              {/* Body container with padding */}
                              <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                                <div>
                                  {/* 2. Course Name */}
                                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px', lineHeight: 1.35 }}>
                                    {course.course_name || course.title || course.name}
                                  </h3>

                                  {/* 3. Course Duration */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '20px' }}>
                                    <span>⏱</span> <strong>Duration:</strong> {course.duration || '3–4 Years'}
                                  </div>
                                </div>

                                {/* 4. Buttons */}
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                  <Link
                                    to={`/courses/${course.id || course.course_id}`}
                                    className="btn-outline btn-sm"
                                    style={{ flexGrow: 1, textAlign: 'center', padding: '10px 14px', fontSize: '0.78rem', textDecoration: 'none' }}
                                  >
                                    Show Colleges
                                  </Link>
                                  <Link
                                    to="/apply"
                                    state={{ course: course }}
                                    className="btn-primary btn-sm"
                                    style={{ flexGrow: 1, textAlign: 'center', padding: '10px 14px', fontSize: '0.78rem' }}
                                  >
                                    Apply
                                  </Link>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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