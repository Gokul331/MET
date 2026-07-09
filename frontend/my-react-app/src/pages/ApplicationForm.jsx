import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitApplication, fetchColleges, fetchCourses } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import { AnimatePresence, motion } from 'framer-motion';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMMUNITIES = ['BC', 'BCM', 'MBC', 'SC', 'ST', 'OC', 'DNC'];

export default function ApplicationForm() {
    const location = useLocation();
    const navigate = useNavigate();

    const prefillCollege = location.state?.college || null;

    const [colleges, setColleges] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    // Derived filtered lists for cascading dropdowns
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableDegreeTypes, setAvailableDegreeTypes] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);

    const [form, setForm] = useState({
        // Preferences
        college_id: prefillCollege?.college_id || prefillCollege?.id || '',
        college_name: prefillCollege?.college_name || prefillCollege?.name || '',
        category: '',
        category_display: '',
        degree_type: '',
        degree_type_display: '',
        course_name: '',
        // Bio-data
        first_name: '',
        last_name: '',
        gender: '',
        dob: '',
        mobile: '',
        email: '',
        blood_group: '',
        community: '',
        aadhar_number: '',
        // Parents
        father_name: '',
        father_mobile: '',
        mother_name: '',
        mother_mobile: '',
        // Address
        address_line1: '',
        address_line2: '',
        city: '',
        pincode: '',
        // Education
        tenth_percentage: '',
        twelfth_percentage: '',
        has_diploma: false,
        diploma_percentage: '',
        has_ug: false,
        ug_percentage: '',
        // Reference
        reference_name: '',
    });

    // Memoized filtered courses by college_id and name
    const collegeCourses = useMemo(() => {
        if (!form.college_id) return [];
        return allCourses.filter(c => {
            const selectedCollege = colleges.find(col => String(col.id) === String(form.college_id));
            return String(c.college) === String(form.college_id) ||
                (selectedCollege && c.college_details?.college_name &&
                 String(c.college_details.college_name).toLowerCase() === String(selectedCollege.college_name).toLowerCase());
        });
    }, [allCourses, form.college_id, colleges]);

    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            setLoading(true);
            try {
                const [collegesData, coursesData] = await Promise.all([
                    fetchColleges(),
                    fetchCourses(),
                ]);
                const cols = Array.isArray(collegesData) ? collegesData : collegesData.results || [];
                const crs = Array.isArray(coursesData) ? coursesData : coursesData.results || [];
                setColleges(cols);
                setAllCourses(crs);

                // If prefill college, derive initial categories by college_id and name
                const collegeId = prefillCollege?.college_id || prefillCollege?.id;
                const collegeName = prefillCollege?.college_name || prefillCollege?.name;
                if (collegeId) {
                    const collegeCoursesFiltered = crs.filter(c => 
                        String(c.college) === String(collegeId) ||
                        (collegeName && c.college_details?.college_name &&
                         String(c.college_details.college_name).toLowerCase() === String(collegeName).toLowerCase())
                    );
                    const cats = getUniqueCategories(collegeCoursesFiltered);
                    setAvailableCategories(cats);
 
                    // If there's only one category, auto-select it
                    if (cats.length === 1) {
                        setForm(prev => ({
                            ...prev,
                            category: cats[0].value,
                            category_display: cats[0].label
                        }));
                    }
                }
            } catch { /* ignore */ }
            finally { setLoading(false); }
        })();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Helpers ──────────────────────────────────────────────────
    const getUniqueCategories = (courses) => {
        const seen = new Map();
        courses.forEach(c => {
            if (c.category && !seen.has(c.category)) {
                seen.set(c.category, c.category_display || c.category);
            }
        });
        return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
    };

    const getUniqueDegreeTypes = (courses) => {
        const seen = new Map();
        courses.forEach(c => {
            if (c.degree_type && !seen.has(c.degree_type)) {
                seen.set(c.degree_type, c.degree_type_display || c.degree_type.toUpperCase());
            }
        });
        return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
    };

    // ── Handlers ─────────────────────────────────────────────────

    const handleCollegeChange = (e) => {
        const collegeId = e.target.value;
        const selected = colleges.find(c => String(c.id) === String(collegeId));
 
        // Filter courses by college_id and name
        const filteredCourses = allCourses.filter(c => 
            String(c.college) === String(collegeId) ||
            (selected && c.college_details?.college_name &&
             String(c.college_details.college_name).toLowerCase() === String(selected.college_name).toLowerCase())
        );
        const cats = getUniqueCategories(filteredCourses);
 
        setAvailableCategories(cats);
        setAvailableDegreeTypes([]);
        setAvailableCourses([]);
        setForm(p => ({
            ...p,
            college_id: collegeId,
            college_name: selected?.college_name || selected?.name || '',
            category: '',
            category_display: '',
            degree_type: '',
            degree_type_display: '',
            course_name: '',
        }));
 
        // Auto-select category if only one available
        if (cats.length === 1) {
            setForm(prev => ({
                ...prev,
                category: cats[0].value,
                category_display: cats[0].label
            }));
        }
 
        if (errors.college_name) setErrors(p => ({ ...p, college_name: '' }));
    };

    const handleCategoryChange = (e) => {
        const cat = e.target.value;
        const catObj = availableCategories.find(c => c.value === cat);
        const filteredCourses = collegeCourses.filter(c => c.category === cat);
        const degreeTypes = getUniqueDegreeTypes(filteredCourses);

        setAvailableDegreeTypes(degreeTypes);
        setAvailableCourses([]);
        setForm(p => ({
            ...p,
            category: cat,
            category_display: catObj?.label || cat,
            degree_type: '',
            degree_type_display: '',
            course_name: '',
        }));

        // Auto-select degree type if only one available
        if (degreeTypes.length === 1) {
            setForm(prev => ({
                ...prev,
                degree_type: degreeTypes[0].value,
                degree_type_display: degreeTypes[0].label
            }));
        }

        if (errors.category) setErrors(p => ({ ...p, category: '' }));
    };

    const handleDegreeTypeChange = (e) => {
        const dt = e.target.value;
        const dtObj = availableDegreeTypes.find(d => d.value === dt);
        const filteredCourses = collegeCourses.filter(
            c => c.category === form.category && c.degree_type === dt
        );

        setAvailableCourses(filteredCourses);
        setForm(p => ({
            ...p,
            degree_type: dt,
            degree_type_display: dtObj?.label || dt,
            course_name: '',
        }));

        // Auto-select course if only one available
        if (filteredCourses.length === 1) {
            setForm(prev => ({
                ...prev,
                course_name: filteredCourses[0].course_name
            }));
        }

        if (errors.degree_type) setErrors(p => ({ ...p, degree_type: '' }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setForm(prev => ({ ...prev, [name]: checked }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateStep = (stepNum) => {
        const errs = {};
        if (stepNum === 1) {
            if (!form.college_id) errs.college_name = 'Please select a preferred college';
            if (!form.category) errs.category = 'Please select a course category';
            if (!form.degree_type) errs.degree_type = 'Please select a degree type';
            if (!form.course_name) errs.course_name = 'Please select a course';
        }
        if (stepNum === 2) {
            if (!form.first_name.trim()) errs.first_name = 'First name is required';
            if (!form.last_name.trim()) errs.last_name = 'Last name is required';
            if (!form.gender) errs.gender = 'Please select gender';
            if (!form.dob) errs.dob = 'Date of birth is required';
            if (!form.mobile || !/^\d{10}$/.test(form.mobile)) errs.mobile = 'Valid 10-digit mobile number is required';
            if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
            if (!form.blood_group) errs.blood_group = 'Please select blood group';
            if (!form.community) errs.community = 'Please select community';
            if (!form.aadhar_number || !/^\d{12}$/.test(form.aadhar_number)) errs.aadhar_number = 'Valid 12-digit Aadhar number is required';
        }
        if (stepNum === 3) {
            if (!form.father_name.trim()) errs.father_name = 'Father name is required';
            if (!form.father_mobile || !/^\d{10}$/.test(form.father_mobile)) errs.father_mobile = 'Valid 10-digit father mobile is required';
            if (!form.mother_name.trim()) errs.mother_name = 'Mother name is required';
            if (!form.mother_mobile || !/^\d{10}$/.test(form.mother_mobile)) errs.mother_mobile = 'Valid 10-digit mother mobile is required';
            if (!form.address_line1.trim()) errs.address_line1 = 'Address Line 1 is required';
            if (!form.city.trim()) errs.city = 'City is required';
            if (!form.pincode || !/^\d{6}$/.test(form.pincode)) errs.pincode = 'Valid 6-digit pincode is required';
        }
        if (stepNum === 4) {
            if (!form.tenth_percentage) errs.tenth_percentage = '10th percentage is required';
            if (!form.twelfth_percentage) errs.twelfth_percentage = '12th percentage is required';
            if (form.has_diploma && !form.diploma_percentage) errs.diploma_percentage = 'Diploma percentage is required';
            if (form.has_ug && !form.ug_percentage) errs.ug_percentage = 'UG percentage is required';
        }
        return errs;
    };

    const nextStep = () => {
        const errs = validateStep(step);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setStep(s => s + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => { setStep(s => s - 1); window.scrollTo(0, 0); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validateStep(step);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setSubmitting(true);
        try {
            const fd = new FormData();
            // Map college_id → college (FK)
            fd.append('college', form.college_id);
            fd.append('college_name', form.college_name);
            fd.append('category', form.category);
            fd.append('degree_type', form.degree_type);
            fd.append('course_name', form.course_name);
            // Bio-data
            fd.append('first_name', form.first_name);
            fd.append('last_name', form.last_name);
            fd.append('gender', form.gender);
            fd.append('dob', form.dob);
            fd.append('mobile', form.mobile);
            fd.append('email', form.email);
            fd.append('blood_group', form.blood_group);
            fd.append('community', form.community);
            fd.append('aadhar_number', form.aadhar_number);
            // Parents
            fd.append('father_name', form.father_name);
            fd.append('father_mobile', form.father_mobile);
            fd.append('mother_name', form.mother_name);
            fd.append('mother_mobile', form.mother_mobile);
            // Address
            fd.append('address_line1', form.address_line1);
            if (form.address_line2) fd.append('address_line2', form.address_line2);
            fd.append('city', form.city);
            fd.append('pincode', form.pincode);
            // Education
            fd.append('tenth_percentage', form.tenth_percentage);
            fd.append('twelfth_percentage', form.twelfth_percentage);
            fd.append('has_diploma', form.has_diploma);
            if (form.has_diploma && form.diploma_percentage) fd.append('diploma_percentage', form.diploma_percentage);
            fd.append('has_ug', form.has_ug);
            if (form.has_ug && form.ug_percentage) fd.append('ug_percentage', form.ug_percentage);
            // Reference
            if (form.reference_name) fd.append('reference_name', form.reference_name);

            const res = await submitApplication(fd);
            navigate('/applications', {
                state: {
                    success: true,
                    email: form.email,
                    message: `Application submitted successfully! Application ID: ${res.application_id}`
                }
            });
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.detail || 'Failed to submit application. Please try again.';
            setErrors({ submit: msg });
        } finally {
            setSubmitting(false);
        }
    };

    const STEPS = ['Preferences', 'Bio-data', 'Parents & Address', 'Education & Reference'];

    return (
        <PageTransition>
            <div className="application-page">

            {/* Hero Section */}
            <section className="application-hero section-hero">
                <div className="hero-bg-pattern" />
                <div className="container">
                    <div className="application-hero-content" style={{ maxWidth: 700 }}>
                        <div className="section-label-premium">
                            <span className="label-dot" />
                            MET Scholarship Scheme
                        </div>
                        <h1 className="hero-title" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)' }}>
                            Apply for <span className="title-highlight">Scholarship</span>
                        </h1>
                        <p className="hero-desc" style={{ maxWidth: 520, fontSize: 'clamp(0.95rem, 1.2vw, 1.08rem)' }}>
                            Fill in your preferences, bio-data, academic records, and parents' information
                            to register for financial assistance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="application-form-section section-md">
                <div className="container container-narrow">
                    {/* Stepper - keep your existing stepper code */}

                    {/* Form */}
                    <form className="application-form card-3d" onSubmit={handleSubmit} style={{
                        padding: 'clamp(20px, 4vw, 40px)',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--r-xl)',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'var(--transition)'
                    }}>
                        {errors.submit && (
                            <div className="error-banner" style={{
                                marginBottom: 24,
                                color: 'var(--red)',
                                border: '1px solid var(--red)',
                                padding: 'clamp(12px, 1.5vw, 14px)',
                                borderRadius: 'var(--r-md)',
                                background: 'rgba(239, 68, 68, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                fontSize: 'clamp(0.85rem, 1vw, 0.92rem)'
                            }}>
                                <span style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>⚠️</span>
                                {errors.submit}
                            </div>
                        )}

                        {/* Step 1: Preferences */}
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step-1"
                                    initial={{ x: 15, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -15, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="form-step"
                                >
                                <h2 className="form-step-title" style={{
                                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                                    fontWeight: 700,
                                    marginBottom: 28,
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 4,
                                        height: 22,
                                        background: 'linear-gradient(180deg, var(--blue), var(--blue-light))',
                                        borderRadius: 'var(--r-full)'
                                    }} />
                                    College &amp; Course Preferences
                                </h2>

                                {loading ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: 'clamp(30px, 5vw, 48px) 0',
                                        color: 'var(--text-muted)'
                                    }}>
                                        <div style={{ fontSize: 'clamp(30px, 4vw, 36px)', marginBottom: 12 }}>⏳</div>
                                        <p style={{ fontWeight: 500 }}>Loading colleges and courses…</p>
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: 'clamp(16px, 2vw, 20px)'
                                    }}>
                                        <div className="form-group" style={{
                                            gridColumn: '1 / -1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6
                                        }}>
                                            <label style={{
                                                fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                                fontWeight: 700,
                                                color: 'var(--text-secondary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.07em'
                                            }}>
                                                College Name *
                                            </label>
                                            <select
                                                id="college_id"
                                                name="college_id"
                                                value={form.college_id}
                                                onChange={handleCollegeChange}
                                                style={{
                                                    padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                    background: 'var(--bg-soft)',
                                                    border: '1.5px solid var(--border)',
                                                    borderRadius: 'var(--r-md)',
                                                    fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                    color: 'var(--text-primary)',
                                                    fontFamily: 'inherit',
                                                    transition: 'var(--transition)',
                                                    outline: 'none',
                                                    width: '100%'
                                                }}
                                            >
                                                <option value="">-- Select College --</option>
                                                {colleges.map(c => (
                                                    <option key={c.college_id || c.id} value={c.college_id || c.id}>
                                                        {c.college_name || c.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.college_name && (
                                                <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>
                                                    {errors.college_name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group" style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6
                                        }}>
                                            <label style={{
                                                fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                                fontWeight: 700,
                                                color: 'var(--text-secondary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.07em'
                                            }}>
                                                Category *
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={form.category}
                                                onChange={handleCategoryChange}
                                                disabled={!form.college_id}
                                                style={{
                                                    padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                    background: !form.college_id ? 'var(--gray-100)' : 'var(--bg-soft)',
                                                    border: '1.5px solid var(--border)',
                                                    borderRadius: 'var(--r-md)',
                                                    fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                    color: 'var(--text-primary)',
                                                    fontFamily: 'inherit',
                                                    transition: 'var(--transition)',
                                                    outline: 'none',
                                                    cursor: !form.college_id ? 'not-allowed' : 'pointer',
                                                    width: '100%'
                                                }}
                                            >
                                                <option value="">
                                                    {!form.college_id ? '-- Select College First --' : '-- Select Category --'}
                                                </option>
                                                {availableCategories.map(cat => (
                                                    <option key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category && (
                                                <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>
                                                    {errors.category}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group" style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6
                                        }}>
                                            <label style={{
                                                fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                                fontWeight: 700,
                                                color: 'var(--text-secondary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.07em'
                                            }}>
                                                Degree Type *
                                            </label>
                                            <select
                                                id="degree_type"
                                                name="degree_type"
                                                value={form.degree_type}
                                                onChange={handleDegreeTypeChange}
                                                disabled={!form.category}
                                                style={{
                                                    padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                    background: !form.category ? 'var(--gray-100)' : 'var(--bg-soft)',
                                                    border: '1.5px solid var(--border)',
                                                    borderRadius: 'var(--r-md)',
                                                    fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                    color: 'var(--text-primary)',
                                                    fontFamily: 'inherit',
                                                    transition: 'var(--transition)',
                                                    outline: 'none',
                                                    cursor: !form.category ? 'not-allowed' : 'pointer',
                                                    width: '100%'
                                                }}
                                            >
                                                <option value="">
                                                    {!form.category ? '-- Select Category First --' : '-- Select Degree Type --'}
                                                </option>
                                                {availableDegreeTypes.map(dt => (
                                                    <option key={dt.value} value={dt.value}>
                                                        {dt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.degree_type && (
                                                <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>
                                                    {errors.degree_type}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group" style={{
                                            gridColumn: '1 / -1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6
                                        }}>
                                            <label style={{
                                                fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                                fontWeight: 700,
                                                color: 'var(--text-secondary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.07em'
                                            }}>
                                                Course Name *
                                            </label>
                                            <select
                                                id="course_name"
                                                name="course_name"
                                                value={form.course_name}
                                                onChange={handleChange}
                                                disabled={!form.degree_type}
                                                style={{
                                                    padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                    background: !form.degree_type ? 'var(--gray-100)' : 'var(--bg-soft)',
                                                    border: '1.5px solid var(--border)',
                                                    borderRadius: 'var(--r-md)',
                                                    fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                    color: 'var(--text-primary)',
                                                    fontFamily: 'inherit',
                                                    transition: 'var(--transition)',
                                                    outline: 'none',
                                                    cursor: !form.degree_type ? 'not-allowed' : 'pointer',
                                                    width: '100%'
                                                }}
                                            >
                                                <option value="">
                                                    {!form.degree_type ? '-- Select Degree Type First --' : '-- Select Course --'}
                                                </option>
                                                {availableCourses.map(c => (
                                                    <option key={c.course_id} value={c.course_name}>
                                                        {c.course_name_display || c.course_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.course_name && (
                                                <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>
                                                    {errors.course_name}
                                                </span>
                                            )}
                                        </div>

                                        {form.college_id && (
                                            <div className="form-group" style={{
                                                gridColumn: '1 / -1'
                                            }}>
                                                <div style={{
                                                    background: 'rgba(37, 99, 235, 0.06)',
                                                    border: '1px solid rgba(37, 99, 235, 0.15)',
                                                    borderRadius: 'var(--r-md)',
                                                    padding: 'clamp(14px, 2vw, 16px) clamp(16px, 2.5vw, 20px)',
                                                    fontSize: 'clamp(0.8rem, 1vw, 0.88rem)',
                                                    lineHeight: 1.8,
                                                    color: 'var(--text-muted)'
                                                }}>
                                                    <strong style={{
                                                        color: 'var(--text-primary)',
                                                        display: 'block',
                                                        marginBottom: 6,
                                                        fontSize: 'clamp(0.85rem, 1vw, 0.9rem)'
                                                    }}>
                                                        📋 Your Selection
                                                    </strong>
                                                    <span><strong>College:</strong> {form.college_name || '—'}</span><br />
                                                    <span><strong>Category:</strong> {form.category_display || '—'}</span><br />
                                                    <span><strong>Degree:</strong> {form.degree_type_display || '—'}</span><br />
                                                    <span><strong>Course:</strong> {form.course_name || '—'}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                </motion.div>
                            )}

                            {/* Step 2: Bio-data */}
                            {step === 2 && (
                                <motion.div
                                    key="step-2"
                                    initial={{ x: 15, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -15, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="form-step"
                                >
                                <h2 className="form-step-title" style={{
                                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                                    fontWeight: 700,
                                    marginBottom: 28,
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 4,
                                        height: 22,
                                        background: 'linear-gradient(180deg, var(--blue), var(--blue-light))',
                                        borderRadius: 'var(--r-full)'
                                    }} />
                                    Student Bio-data
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: 'clamp(16px, 2vw, 20px)'
                                }}>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>First Name *</label>
                                        <input
                                            name="first_name"
                                            value={form.first_name}
                                            onChange={handleChange}
                                            placeholder="First name"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.first_name && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.first_name}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Last Name *</label>
                                        <input
                                            name="last_name"
                                            value={form.last_name}
                                            onChange={handleChange}
                                            placeholder="Last name"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.last_name && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.last_name}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Gender *</label>
                                        <select
                                            name="gender"
                                            value={form.gender}
                                            onChange={handleChange}
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.gender && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.gender}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Date of Birth *</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={form.dob}
                                            onChange={handleChange}
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.dob && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.dob}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Mobile Number *</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={form.mobile}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile number"
                                            maxLength={10}
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.mobile && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.mobile}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Email ID *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="name@domain.com"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.email && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.email}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Blood Group *</label>
                                        <select
                                            name="blood_group"
                                            value={form.blood_group}
                                            onChange={handleChange}
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        >
                                            <option value="">Select Blood Group</option>
                                            {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                        {errors.blood_group && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.blood_group}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Community *</label>
                                        <select
                                            name="community"
                                            value={form.community}
                                            onChange={handleChange}
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        >
                                            <option value="">Select Community</option>
                                            {COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        {errors.community && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.community}</span>}
                                    </div>
                                    <div className="form-group" style={{
                                        gridColumn: '1 / -1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 6
                                    }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Aadhar Number *</label>
                                        <input
                                            name="aadhar_number"
                                            value={form.aadhar_number}
                                            onChange={handleChange}
                                            placeholder="12-digit Aadhar number"
                                            maxLength={12}
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.aadhar_number && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.aadhar_number}</span>}
                                    </div>
                                </div>
                                </motion.div>
                            )}

                            {/* Step 3: Parents & Address */}
                            {step === 3 && (
                                <motion.div
                                    key="step-3"
                                    initial={{ x: 15, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -15, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="form-step"
                                >
                                <h2 className="form-step-title" style={{
                                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                                    fontWeight: 700,
                                    marginBottom: 28,
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 4,
                                        height: 22,
                                        background: 'linear-gradient(180deg, var(--blue), var(--blue-light))',
                                        borderRadius: 'var(--r-full)'
                                    }} />
                                    Parent's Details &amp; Address
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: 'clamp(16px, 2vw, 20px)'
                                }}>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Father's Name *</label>
                                        <input
                                            name="father_name"
                                            value={form.father_name}
                                            onChange={handleChange}
                                            placeholder="Father name"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.father_name && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.father_name}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Father's Mobile *</label>
                                        <input
                                            type="tel"
                                            name="father_mobile"
                                            value={form.father_mobile}
                                            onChange={handleChange}
                                            placeholder="Father 10-digit mobile"
                                            maxLength={10}
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.father_mobile && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.father_mobile}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Mother's Name *</label>
                                        <input
                                            name="mother_name"
                                            value={form.mother_name}
                                            onChange={handleChange}
                                            placeholder="Mother name"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.mother_name && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.mother_name}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Mother's Mobile *</label>
                                        <input
                                            type="tel"
                                            name="mother_mobile"
                                            value={form.mother_mobile}
                                            onChange={handleChange}
                                            placeholder="Mother 10-digit mobile"
                                            maxLength={10}
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.mother_mobile && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.mother_mobile}</span>}
                                    </div>
                                    <div className="form-group" style={{
                                        gridColumn: '1 / -1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 6
                                    }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Address Line 1 *</label>
                                        <input
                                            name="address_line1"
                                            value={form.address_line1}
                                            onChange={handleChange}
                                            placeholder="Door No, Street Name, Locality"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.address_line1 && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.address_line1}</span>}
                                    </div>
                                    <div className="form-group" style={{
                                        gridColumn: '1 / -1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 6
                                    }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Address Line 2</label>
                                        <input
                                            name="address_line2"
                                            value={form.address_line2}
                                            onChange={handleChange}
                                            placeholder="Landmark, Area (Optional)"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>City *</label>
                                        <input
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            placeholder="City / District"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.city && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.city}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Pincode *</label>
                                        <input
                                            name="pincode"
                                            value={form.pincode}
                                            onChange={handleChange}
                                            placeholder="6-digit pincode"
                                            maxLength={6}
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.pincode && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.pincode}</span>}
                                    </div>
                                </div>
                                </motion.div>
                            )}

                            {/* Step 4: Education & Reference */}
                            {step === 4 && (
                                <motion.div
                                    key="step-4"
                                    initial={{ x: 15, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -15, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="form-step"
                                >
                                <h2 className="form-step-title" style={{
                                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                                    fontWeight: 700,
                                    marginBottom: 28,
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 4,
                                        height: 22,
                                        background: 'linear-gradient(180deg, var(--blue), var(--blue-light))',
                                        borderRadius: 'var(--r-full)'
                                    }} />
                                    Education &amp; Reference
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: 'clamp(16px, 2vw, 20px)'
                                }}>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>10th Marks Percentage *</label>
                                        <input
                                            type="number"
                                            name="tenth_percentage"
                                            value={form.tenth_percentage}
                                            onChange={handleChange}
                                            placeholder="e.g. 92.5"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.tenth_percentage && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.tenth_percentage}</span>}
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>12th Marks Percentage *</label>
                                        <input
                                            type="number"
                                            name="twelfth_percentage"
                                            value={form.twelfth_percentage}
                                            onChange={handleChange}
                                            placeholder="e.g. 88.3"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                        {errors.twelfth_percentage && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.twelfth_percentage}</span>}
                                    </div>

                                    <div className="form-group" style={{
                                        gridColumn: '1 / -1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '8px 0'
                                    }}>
                                        <input
                                            type="checkbox"
                                            id="has_diploma"
                                            name="has_diploma"
                                            checked={form.has_diploma}
                                            onChange={handleChange}
                                            style={{
                                                width: 18,
                                                height: 18,
                                                accentColor: 'var(--blue)',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <label htmlFor="has_diploma" style={{
                                            margin: 0,
                                            cursor: 'pointer',
                                            fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                            fontWeight: 600,
                                            color: 'var(--text-secondary)'
                                        }}>
                                            Has Diploma
                                        </label>
                                    </div>

                                    {form.has_diploma && (
                                        <div className="form-group" style={{
                                            gridColumn: '1 / -1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6,
                                            animation: 'fadeInUp 0.3s var(--ease) both'
                                        }}>
                                            <label style={{
                                                fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                                fontWeight: 700,
                                                color: 'var(--text-secondary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.07em'
                                            }}>Diploma Marks Percentage *</label>
                                            <input
                                                type="number"
                                                name="diploma_percentage"
                                                value={form.diploma_percentage}
                                                onChange={handleChange}
                                                placeholder="Diploma %"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                style={{
                                                    padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                    background: 'var(--bg-soft)',
                                                    border: '1.5px solid var(--border)',
                                                    borderRadius: 'var(--r-md)',
                                                    fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                    color: 'var(--text-primary)',
                                                    fontFamily: 'inherit',
                                                    transition: 'var(--transition)',
                                                    outline: 'none',
                                                    width: '100%'
                                                }}
                                            />
                                            {errors.diploma_percentage && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.diploma_percentage}</span>}
                                        </div>
                                    )}

                                    <div className="form-group" style={{
                                        gridColumn: '1 / -1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '8px 0'
                                    }}>
                                        <input
                                            type="checkbox"
                                            id="has_ug"
                                            name="has_ug"
                                            checked={form.has_ug}
                                            onChange={handleChange}
                                            style={{
                                                width: 18,
                                                height: 18,
                                                accentColor: 'var(--blue)',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <label htmlFor="has_ug" style={{
                                            margin: 0,
                                            cursor: 'pointer',
                                            fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                            fontWeight: 600,
                                            color: 'var(--text-secondary)'
                                        }}>
                                            Has Undergraduate (UG)
                                        </label>
                                    </div>

                                    {form.has_ug && (
                                        <div className="form-group" style={{
                                            gridColumn: '1 / -1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6,
                                            animation: 'fadeInUp 0.3s var(--ease) both'
                                        }}>
                                            <label style={{
                                                fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                                fontWeight: 700,
                                                color: 'var(--text-secondary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.07em'
                                            }}>UG Marks Percentage *</label>
                                            <input
                                                type="number"
                                                name="ug_percentage"
                                                value={form.ug_percentage}
                                                onChange={handleChange}
                                                placeholder="UG %"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                style={{
                                                    padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                    background: 'var(--bg-soft)',
                                                    border: '1.5px solid var(--border)',
                                                    borderRadius: 'var(--r-md)',
                                                    fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                    color: 'var(--text-primary)',
                                                    fontFamily: 'inherit',
                                                    transition: 'var(--transition)',
                                                    outline: 'none',
                                                    width: '100%'
                                                }}
                                            />
                                            {errors.ug_percentage && <span className="form-error" style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.76rem)', color: 'var(--red)' }}>{errors.ug_percentage}</span>}
                                        </div>
                                    )}

                                    <div className="form-group" style={{
                                        gridColumn: '1 / -1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 6
                                    }}>
                                        <label style={{
                                            fontSize: 'clamp(0.7rem, 0.9vw, 0.78rem)',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.07em'
                                        }}>Reference Name (Optional)</label>
                                        <input
                                            name="reference_name"
                                            value={form.reference_name}
                                            onChange={handleChange}
                                            placeholder="Name of person who referred you"
                                            style={{
                                                padding: 'clamp(10px, 1.2vw, 11px) clamp(12px, 1.5vw, 14px)',
                                                background: 'var(--bg-soft)',
                                                border: '1.5px solid var(--border)',
                                                borderRadius: 'var(--r-md)',
                                                fontSize: 'clamp(0.85rem, 1vw, 0.9rem)',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'inherit',
                                                transition: 'var(--transition)',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                    </div>
                                </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form Actions */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: 32,
                            borderTop: '1px solid var(--border)',
                            paddingTop: 24,
                            flexWrap: 'wrap',
                            gap: '12px'
                        }}>
                            {step > 1 ? (
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={prevStep}
                                    style={{
                                        padding: 'clamp(10px, 1.5vw, 11px) clamp(18px, 2.5vw, 26px)',
                                        background: 'var(--white)',
                                        color: 'var(--blue)',
                                        border: '1.5px solid var(--blue-muted)',
                                        borderRadius: 'var(--r-full)',
                                        fontWeight: 700,
                                        fontSize: 'clamp(0.85rem, 1.2vw, 0.92rem)',
                                        cursor: 'pointer',
                                        transition: 'var(--transition)',
                                        fontFamily: 'inherit',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    ← Back
                                </button>
                            ) : (
                                <div />
                            )}
                            {step < STEPS.length ? (
                                <button
                                    type="button"
                                    className="btn-dark"
                                    onClick={nextStep}
                                    style={{
                                        padding: 'clamp(10px, 1.5vw, 12px) clamp(20px, 3vw, 28px)',
                                        background: 'linear-gradient(135deg, var(--blue), var(--blue-dark))',
                                        color: '#fff',
                                        borderRadius: 'var(--r-full)',
                                        fontWeight: 700,
                                        fontSize: 'clamp(0.85rem, 1.2vw, 0.92rem)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'var(--transition)',
                                        fontFamily: 'inherit',
                                        boxShadow: 'var(--shadow-blue)',
                                        minWidth: '120px'
                                    }}
                                >
                                    Continue →
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="btn-dark btn-submit"
                                    disabled={submitting}
                                    style={{
                                        padding: 'clamp(12px, 1.5vw, 15px) clamp(24px, 3vw, 38px)',
                                        background: 'linear-gradient(135deg, var(--blue), var(--blue-dark))',
                                        color: '#fff',
                                        borderRadius: 'var(--r-full)',
                                        fontWeight: 700,
                                        fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                                        border: 'none',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        transition: 'var(--transition)',
                                        fontFamily: 'inherit',
                                        boxShadow: 'var(--shadow-blue)',
                                        opacity: submitting ? 0.55 : 1,
                                        minWidth: '200px'
                                    }}
                                >
                                    {submitting ? 'Submitting...' : '🎓 Submit'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </section>

            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .container-narrow {
                        padding: 0 16px !important;
                    }
                    
                    .form-actions {
                        flex-direction: column-reverse !important;
                        align-items: stretch !important;
                    }
                    
                    .form-actions button,
                    .form-actions .btn-outline,
                    .form-actions .btn-dark {
                        width: 100% !important;
                        justify-content: center !important;
                    }
                    
                    .section-hero {
                        padding: 90px 0 40px !important;
                    }
                    
                    .section-md {
                        padding: 40px 0 !important;
                    }
                    
                    .application-form {
                        padding: 20px !important;
                    }
                }

                @media (max-width: 480px) {
                    .application-form {
                        padding: 16px !important;
                    }
                    
                    .stepper-label {
                        font-size: 0.6rem !important;
                    }
                    
                    .stepper-circle {
                        width: 28px !important;
                        height: 28px !important;
                        font-size: 0.7rem !important;
                    }
                    
                    .hero-title {
                        font-size: 1.8rem !important;
                    }
                    
                    .container-narrow {
                        padding: 0 12px !important;
                    }
                }

                @media (max-width: 400px) {
                    .stepper-label {
                        display: none !important;
                    }
                    
                    .stepper-circle {
                        width: 32px !important;
                        height: 32px !important;
                    }
                }
            `}</style>
        </div>
        </PageTransition>
    );
}