import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitApplication, fetchColleges, fetchCourses } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Logo from '../assets/Logo.png';

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
    const [isSuccess, setIsSuccess] = useState(false); // User had it set to true for testing
    const [showSuccessUI, setShowSuccessUI] = useState(false);
    const [successAppId, setSuccessAppId] = useState(null);
    const [countdown, setCountdown] = useState(5);
    // Derived filtered lists for cascading dropdowns (computed below)

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

    const availableCategories = useMemo(() => {
        const seen = new Map();
        collegeCourses.forEach(c => {
            if (c.category && !seen.has(c.category)) {
                seen.set(c.category, c.category_display || c.category);
            }
        });
        return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
    }, [collegeCourses]);

    const availableDegreeTypes = useMemo(() => {
        if (!form.category) return [];
        const seen = new Map();
        collegeCourses.filter(c => c.category === form.category).forEach(c => {
            if (c.degree_type && !seen.has(c.degree_type)) {
                seen.set(c.degree_type, c.degree_type_display || c.degree_type.toUpperCase());
            }
        });
        return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
    }, [collegeCourses, form.category]);

    const availableCourses = useMemo(() => {
        if (!form.degree_type) return [];
        return collegeCourses.filter(c => c.category === form.category && c.degree_type === form.degree_type);
    }, [collegeCourses, form.category, form.degree_type]);

    useEffect(() => {
        if (availableCategories.length === 1 && form.category !== availableCategories[0].value) {
            setForm(prev => ({
                ...prev,
                category: availableCategories[0].value,
                category_display: availableCategories[0].label
            }));
        }
    }, [availableCategories, form.category]);

    useEffect(() => {
        if (availableDegreeTypes.length === 1 && form.degree_type !== availableDegreeTypes[0].value) {
            setForm(prev => ({
                ...prev,
                degree_type: availableDegreeTypes[0].value,
                degree_type_display: availableDegreeTypes[0].label
            }));
        }
    }, [availableDegreeTypes, form.degree_type]);

    useEffect(() => {
        if (availableCourses.length === 1 && form.course_name !== availableCourses[0].course_name) {
            setForm(prev => ({
                ...prev,
                course_name: availableCourses[0].course_name
            }));
        }
    }, [availableCourses, form.course_name]);

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

    // ── Handlers ─────────────────────────────────────────────────

    const handleCollegeChange = (e) => {
        const collegeId = e.target.value;
        const selected = colleges.find(c => String(c.id) === String(collegeId));

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

        if (errors.college_name) setErrors(p => ({ ...p, college_name: '' }));
    };

    const handleCategoryChange = (e) => {
        const cat = e.target.value;
        const catObj = availableCategories.find(c => c.value === cat);

        setForm(p => ({
            ...p,
            category: cat,
            category_display: catObj?.label || cat,
            degree_type: '',
            degree_type_display: '',
            course_name: '',
        }));

        if (errors.category) setErrors(p => ({ ...p, category: '' }));
    };

    const handleDegreeTypeChange = (e) => {
        const dt = e.target.value;
        const dtObj = availableDegreeTypes.find(d => d.value === dt);

        setForm(p => ({
            ...p,
            degree_type: dt,
            degree_type_display: dtObj?.label || dt,
            course_name: '',
        }));

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
            setSuccessAppId(res.application_id);
            setIsSuccess(true);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.detail || 'Failed to submit application. Please try again.';
            setErrors({ submit: msg });
        } finally {
            setSubmitting(false);
        }
    };

    const STEPS = ['Preferences', 'Bio-data', 'Parents & Address', 'Education & Reference'];

    useEffect(() => {
        if (isSuccess && !showSuccessUI) {
            const loadTimer = setTimeout(() => {
                setShowSuccessUI(true);
            }, 1000);
            return () => clearTimeout(loadTimer);
        }

        if (isSuccess && showSuccessUI) {
            // Trigger confetti
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#005baa', '#fdb813', '#ffffff']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#005baa', '#fdb813', '#ffffff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate('/');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isSuccess, showSuccessUI, navigate]);

    const selectedCollege = colleges.find(c => String(c.id) === String(form.college_id));
    const selectedCourseImage = selectedCollege?.primary_image_url || selectedCollege?.cover_image || selectedCollege?.logo_url || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80";

    if (isSuccess) {
        if (!showSuccessUI) {
            return (
                <PageTransition>
                    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)', padding: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px', height: '60px', border: '5px solid var(--gray-200)', borderTopColor: 'var(--blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px'
                            }} />
                            <h2 style={{ color: 'var(--text-secondary)' }}>Processing Application...</h2>
                        </div>
                    </div>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </PageTransition>
            );
        }

        return (
            <PageTransition>
                <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)', padding: '20px' }}>
                    <div style={{ position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '50px 30px', maxWidth: '600px', width: '100%', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid var(--border)' }}>
                        {/* Background Logo Watermark */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '70%',
                            height: '70%',
                            backgroundImage: `url(${Logo})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'contain',
                            opacity: 0.05,
                            pointerEvents: 'none',
                            zIndex: 0
                        }} />
                        
                        {/* Main Content */}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <img src={Logo} alt="MET Logo" style={{ height: '70px', marginBottom: '24px', objectFit: 'contain' }} />
                            
                            <div className="success-checkmark" style={{ marginBottom: '20px' }}>
                                <div className="check-icon">
                                    <span className="icon-line line-tip"></span>
                                    <span className="icon-line line-long"></span>
                                    <div className="icon-circle"></div>
                                    <div className="icon-fix"></div>
                                </div>
                            </div>

                            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', color: '#4CAF50', marginBottom: '16px', fontWeight: 800 }}>
                                Application Submitted!
                            </h1>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: 1.6 }}>
                                Thank you! Your application number is <strong style={{ color: 'var(--blue)' }}>{successAppId || 'MET-10294'}</strong>. Our team <strong style={{
                                    background: 'linear-gradient(to right, #001f3f, #0074D9)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: '900'
                                }}>MARI EDUCATION TRUST</strong> will contact you soon.
                            </p>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'var(--blue-pale)', padding: '12px 24px', borderRadius: '50px' }}>
                                <span style={{ width: '18px', height: '18px', border: '3px solid var(--blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                <p style={{ fontSize: '0.95rem', color: 'var(--blue)', fontWeight: 700, margin: 0 }}>
                                    Redirecting to home page in {countdown} seconds...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .success-checkmark {
                        width: 80px;
                        height: 80px;
                        margin: 0 auto;
                    }
                    .check-icon {
                        width: 80px;
                        height: 80px;
                        position: relative;
                        border-radius: 50%;
                        box-sizing: content-box;
                        border: 4px solid #4CAF50;
                    }
                    .icon-line {
                        height: 5px;
                        background-color: #4CAF50;
                        display: block;
                        border-radius: 2px;
                        position: absolute;
                        z-index: 10;
                    }
                    .icon-line.line-tip {
                        top: 46px;
                        left: 14px;
                        width: 25px;
                        transform: rotate(45deg);
                        animation: icon-line-tip 0.75s;
                    }
                    .icon-line.line-long {
                        top: 38px;
                        right: 8px;
                        width: 47px;
                        transform: rotate(-45deg);
                        animation: icon-line-long 0.75s;
                    }
                    .icon-circle {
                        top: -4px;
                        left: -4px;
                        z-index: 10;
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        position: absolute;
                        box-sizing: content-box;
                        border: 4px solid rgba(76, 175, 80, .5);
                    }
                    .icon-fix {
                        top: 8px;
                        width: 5px;
                        left: 26px;
                        z-index: 1;
                        height: 85px;
                        position: absolute;
                        transform: rotate(-45deg);
                        background-color: #fff;
                    }
                    @keyframes icon-line-tip {
                        0% { width: 0; left: 1px; top: 19px; }
                        54% { width: 0; left: 1px; top: 19px; }
                        70% { width: 50px; left: -8px; top: 37px; }
                        84% { width: 17px; left: 21px; top: 48px; }
                        100% { width: 25px; left: 14px; top: 46px; }
                    }
                    @keyframes icon-line-long {
                        0% { width: 0; right: 46px; top: 54px; }
                        65% { width: 0; right: 46px; top: 54px; }
                        84% { width: 55px; right: 0px; top: 35px; }
                        100% { width: 47px; right: 8px; top: 38px; }
                    }
                `}</style>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="application-page">

                <section className="application-form-section">
                    <div className="container" style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Scholarship Application
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Please complete all the steps below to submit your application.
                        </p>
                    </div>
                    <div className="container application-split-layout has-summary-sidebar">
                        <div className="application-sidebar-left">
                            <div className="sidebar-sticky-wrapper">
                                <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.05rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            color: 'var(--text-primary)',
                                            padding: 0
                                        }}
                                    >
                                        ← New Application
                                    </button>
                                </div>
                                <div className="vertical-stepper">
                                    {STEPS.map((stepName, i) => {
                                        const stepNum = i + 1;
                                        const isActive = step === stepNum;
                                        const isCompleted = step > stepNum;
                                        const statusClass = isActive ? 'active' : isCompleted ? 'completed' : 'inactive';
                                        return (
                                            <div key={stepName} className={`vertical-step-item ${statusClass}`}>
                                                <div className={`step-circle ${statusClass}`}>
                                                    {isCompleted ? '✓' : stepNum}
                                                </div>
                                                <div className="step-content">
                                                    <span className="step-title">{stepName}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="application-main-column">
                            {/* Form */}
                            <form className="application-form" onSubmit={handleSubmit}>
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
                                                <div className="form-fields-container">

                                                    <div className="form-fields-vertical" style={{ display: 'flex', flexDirection: 'column' }}>

                                                        <div className="form-row-horizontal">
                                                            <div className="form-label-col">
                                                                <label>College Name *</label>
                                                                <span className="label-desc">Select the partner college</span>
                                                            </div>
                                                            <div className="form-input-col">
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
                                                        </div>

                                                        <div className="form-row-horizontal">
                                                            <div className="form-label-col">
                                                                <label>Category *</label>
                                                                <span className="label-desc">Select course category</span>
                                                            </div>
                                                            <div className="form-input-col">
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
                                                        </div>

                                                        <div className="form-row-horizontal">
                                                            <div className="form-label-col">
                                                                <label>Degree Type *</label>
                                                                <span className="label-desc">Select degree level</span>
                                                            </div>
                                                            <div className="form-input-col">
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
                                                        </div>

                                                        <div className="form-row-horizontal">
                                                            <div className="form-label-col">
                                                                <label>Course Name *</label>
                                                                <span className="label-desc">Select specific course</span>
                                                            </div>
                                                            <div className="form-input-col">
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
                                                        </div>

                                                    </div>
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
                                            <div className="form-fields-vertical" style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>First Name *</label>
                                                        <span className="label-desc">Enter your legal first name</span>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Last Name *</label>
                                                        <span className="label-desc">Enter your legal last name</span>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Gender *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Date of Birth *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Mobile Number *</label>
                                                        <span className="label-desc">10-digit mobile number</span>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Email ID *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Blood Group *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Community *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Aadhar Number *</label>
                                                        <span className="label-desc">12-digit Aadhar number</span>
                                                    </div>
                                                    <div className="form-input-col">
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
                                            <div className="form-fields-vertical" style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Father's Name *</label>
                                                        <span className="label-desc">Enter father's full name</span>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Father's Mobile *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Mother's Name *</label>
                                                        <span className="label-desc">Enter mother's full name</span>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Mother's Mobile *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Address Line 1 *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Address Line 2</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>City *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Pincode *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                            <div className="form-fields-vertical" style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>10th Marks Percentage *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>12th Marks Percentage *</label>
                                                    </div>
                                                    <div className="form-input-col">
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
                                                </div>

                                                <div className="form-row-horizontal" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                                    <div className="form-label-col">
                                                        <label>Has Diploma</label>
                                                    </div>
                                                    <div className="form-input-col" style={{ display: 'flex', alignItems: 'center' }}>
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
                                                    </div>
                                                </div>

                                                {form.has_diploma && (
                                                    <div className="form-row-horizontal" style={{ paddingTop: 0, animation: 'fadeInUp 0.3s var(--ease) both' }}>
                                                        <div className="form-label-col">
                                                            <label>Diploma Marks Percentage *</label>
                                                        </div>
                                                        <div className="form-input-col">
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
                                                    </div>
                                                )}

                                                <div className="form-row-horizontal" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                                    <div className="form-label-col">
                                                        <label>Has Undergraduate (UG)</label>
                                                    </div>
                                                    <div className="form-input-col" style={{ display: 'flex', alignItems: 'center' }}>
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
                                                    </div>
                                                </div>

                                                {form.has_ug && (
                                                    <div className="form-row-horizontal" style={{ paddingTop: 0, animation: 'fadeInUp 0.3s var(--ease) both' }}>
                                                        <div className="form-label-col">
                                                            <label>UG Marks Percentage *</label>
                                                        </div>
                                                        <div className="form-input-col">
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
                                                    </div>
                                                )}

                                                <div className="form-row-horizontal">
                                                    <div className="form-label-col">
                                                        <label>Reference Name (Optional)</label>
                                                        <span className="label-desc">Name of person who referred you</span>
                                                    </div>
                                                    <div className="form-input-col">
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
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Form Actions */}
                                <div className="form-actions" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: 24,
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

                        <div className="application-sidebar-right">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>Selected College</h3>
                            {selectedCollege ? (
                                <>
                                    <div style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: '16px', boxShadow: 'var(--shadow-sm)' }}>
                                        <img src={selectedCourseImage} alt={selectedCollege.name} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: '1.4' }}>{selectedCollege.name}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                        <span style={{ marginTop: '2px' }}>📍</span> {selectedCollege.location || 'Tamil Nadu'}
                                    </p>
                                    {form.course_name && (
                                        <div style={{ background: 'var(--bg-soft)', padding: '14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>Course Applied</span>
                                            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.4', display: 'block' }}>{form.course_name}</strong>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: '1px dashed var(--border)' }}>
                                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px', opacity: 0.4 }}>🏛️</span>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Select a college to view its details</p>
                                </div>
                            )}
                        </div>
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
                    
                    .step-title {
                        font-size: 0.6rem !important;
                    }
                    
                    .step-circle {
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
                    .step-title {
                        display: none !important;
                    }
                    
                    .step-circle {
                        width: 32px !important;
                        height: 32px !important;
                    }
                }
            `}</style>
            </div>
        </PageTransition>
    );
}