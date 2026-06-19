import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitApplication, fetchColleges } from '../services/api';

const QUOTA_TYPES = ['management', 'government', 'nri', 'special'];
const COURSES_LIST = ['Engineering', 'Medical (MBBS)', 'Nursing', 'Allied Health Science', 'Arts & Science', 'Law', 'MBA / MCA', 'Pharmacy', 'Architecture', 'Polytechnic / Diploma'];

export default function ApplicationForm() {
    const location = useLocation();
    const navigate = useNavigate();

    const prefillCollege = location.state?.college || null;
    const prefillQuota = location.state?.quotaType || 'management';

    const [colleges, setColleges] = useState([]);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        // Personal
        full_name: '',
        dob: '',
        gender: '',
        nationality: 'Indian',
        mobile: '',
        email: '',
        address: '',
        // Academic
        tenth_percentage: '',
        twelfth_percentage: '',
        twelfth_stream: '',
        entrance_exam: '',
        entrance_score: '',
        // College preference
        college_id: prefillCollege?.college_id || '',
        college_name: prefillCollege?.college_name || '',
        course_preference: '',
        quota_type: prefillQuota,
        // Documents
        photo: null,
        tenth_marksheet: null,
        twelfth_marksheet: null,
        aadhar: null,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            try {
                const data = await fetchColleges();
                setColleges(Array.isArray(data) ? data : data.results || []);
            } catch { /* ignore */ }
        })();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateStep = (stepNum) => {
        const errs = {};
        if (stepNum === 1) {
            if (!form.full_name.trim()) errs.full_name = 'Full name is required';
            if (!form.dob) errs.dob = 'Date of birth is required';
            if (!form.gender) errs.gender = 'Please select gender';
            if (!form.mobile || !/^\d{10}$/.test(form.mobile)) errs.mobile = 'Valid 10-digit mobile number is required';
            if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
        }
        if (stepNum === 2) {
            if (!form.tenth_percentage) errs.tenth_percentage = '10th percentage is required';
            if (!form.twelfth_percentage) errs.twelfth_percentage = '12th percentage is required';
            if (!form.twelfth_stream) errs.twelfth_stream = 'Stream is required';
        }
        if (stepNum === 3) {
            if (!form.course_preference) errs.course_preference = 'Please select a course';
            if (!form.quota_type) errs.quota_type = 'Please select quota type';
        }
        return errs;
    };

    const nextStep = () => {
        const errs = validateStep(step);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setStep((s) => s + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => { setStep((s) => s - 1); window.scrollTo(0, 0); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validateStep(step);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setSubmitting(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([key, val]) => {
                if (val !== null && val !== '') fd.append(key, val);
            });
            await submitApplication(fd);
            navigate('/', { state: { success: true, message: 'Application submitted successfully! We will contact you shortly.' } });
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
            navigate('/', { state: { error: true, message: msg } });
        } finally {
            setSubmitting(false);
        }
    };

    const STEPS = ['Personal Info', 'Academic Details', 'College Preference', 'Documents'];

    return (
        <div className="application-page">

            <section className="application-hero">
                <div className="hero-bg-pattern" />
                <div className="container">
                    <div className="application-hero-content">
                        <div className="section-label-premium"><span className="label-dot" />Admissions {new Date().getFullYear()}</div>
                        <h1>Apply <span className="title-highlight">Now</span></h1>
                        <p>Begin your journey to your dream college. Fill in your details and our counselors will guide you.</p>
                    </div>
                </div>
            </section>

            <section className="application-form-section">
                <div className="container">
                    {/* Stepper */}
                    <div className="form-stepper">
                        {STEPS.map((label, i) => (
                            <div key={i} className={`stepper-step${step === i + 1 ? ' active' : ''}${step > i + 1 ? ' completed' : ''}`}>
                                <div className="stepper-circle">{step > i + 1 ? '✓' : i + 1}</div>
                                <span className="stepper-label">{label}</span>
                                {i < STEPS.length - 1 && <div className="stepper-line" />}
                            </div>
                        ))}
                    </div>

                    <form className="application-form card-3d" onSubmit={handleSubmit}>
                        {/* Step 1 – Personal Info */}
                        {step === 1 && (
                            <div className="form-step">
                                <h2 className="form-step-title">Personal Information</h2>
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Enter your full name" />
                                        {errors.full_name && <span className="form-error">{errors.full_name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth *</label>
                                        <input type="date" name="dob" value={form.dob} onChange={handleChange} />
                                        {errors.dob && <span className="form-error">{errors.dob}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Gender *</label>
                                        <select name="gender" value={form.gender} onChange={handleChange}>
                                            <option value="">Select Gender</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                        {errors.gender && <span className="form-error">{errors.gender}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Nationality</label>
                                        <input name="nationality" value={form.nationality} onChange={handleChange} placeholder="Nationality" />
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number *</label>
                                        <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} />
                                        {errors.mobile && <span className="form-error">{errors.mobile}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                                        {errors.email && <span className="form-error">{errors.email}</span>}
                                    </div>
                                    <div className="form-group form-group--full">
                                        <label>Address</label>
                                        <textarea name="address" value={form.address} onChange={handleChange} placeholder="Full residential address" rows={3} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2 – Academic */}
                        {step === 2 && (
                            <div className="form-step">
                                <h2 className="form-step-title">Academic Details</h2>
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label>10th Percentage / CGPA *</label>
                                        <input type="number" name="tenth_percentage" value={form.tenth_percentage} onChange={handleChange} placeholder="e.g. 85.5" min="0" max="100" step="0.01" />
                                        {errors.tenth_percentage && <span className="form-error">{errors.tenth_percentage}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>12th Percentage / CGPA *</label>
                                        <input type="number" name="twelfth_percentage" value={form.twelfth_percentage} onChange={handleChange} placeholder="e.g. 90.0" min="0" max="100" step="0.01" />
                                        {errors.twelfth_percentage && <span className="form-error">{errors.twelfth_percentage}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>12th Stream *</label>
                                        <select name="twelfth_stream" value={form.twelfth_stream} onChange={handleChange}>
                                            <option value="">Select Stream</option>
                                            <option>Science (Physics, Chemistry, Biology)</option>
                                            <option>Science (Physics, Chemistry, Maths)</option>
                                            <option>Commerce</option>
                                            <option>Arts / Humanities</option>
                                            <option>Vocational</option>
                                        </select>
                                        {errors.twelfth_stream && <span className="form-error">{errors.twelfth_stream}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Entrance Exam Appeared</label>
                                        <select name="entrance_exam" value={form.entrance_exam} onChange={handleChange}>
                                            <option value="">Select Exam (if any)</option>
                                            <option>NEET</option>
                                            <option>JEE Main</option>
                                            <option>JEE Advanced</option>
                                            <option>TNEA</option>
                                            <option>CLAT</option>
                                            <option>Other</option>
                                            <option>Not Appeared</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Entrance Exam Score / Rank</label>
                                        <input name="entrance_score" value={form.entrance_score} onChange={handleChange} placeholder="Score or Rank (e.g. 450 / 5000)" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3 – College Preference */}
                        {step === 3 && (
                            <div className="form-step">
                                <h2 className="form-step-title">College &amp; Course Preference</h2>
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label>Preferred College</label>
                                        <select name="college_id" value={form.college_id} onChange={(e) => {
                                            const selected = colleges.find((c) => String(c.college_id || c.id) === e.target.value);
                                            setForm((p) => ({ ...p, college_id: e.target.value, college_name: selected?.college_name || selected?.name || '' }));
                                        }}>
                                            <option value="">Select a College (Optional)</option>
                                            {colleges.map((c) => (
                                                <option key={c.college_id || c.id} value={c.college_id || c.id}>{c.college_name || c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Course Preference *</label>
                                        <select name="course_preference" value={form.course_preference} onChange={handleChange}>
                                            <option value="">Select Course</option>
                                            {COURSES_LIST.map((c) => <option key={c}>{c}</option>)}
                                        </select>
                                        {errors.course_preference && <span className="form-error">{errors.course_preference}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Quota Type *</label>
                                        <select name="quota_type" value={form.quota_type} onChange={handleChange}>
                                            {QUOTA_TYPES.map((q) => <option key={q} value={q}>{q.charAt(0).toUpperCase() + q.slice(1)} Quota</option>)}
                                        </select>
                                        {errors.quota_type && <span className="form-error">{errors.quota_type}</span>}
                                    </div>
                                </div>

                                {form.college_name && (
                                    <div className="selected-college-badge">
                                        <span>🏫</span>
                                        <div>
                                            <strong>Selected College</strong>
                                            <span>{form.college_name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4 – Documents */}
                        {step === 4 && (
                            <div className="form-step">
                                <h2 className="form-step-title">Upload Documents</h2>
                                <p className="form-step-desc">Upload clear scanned copies or photos of your documents. Accepted formats: JPG, PNG, PDF. Max 5MB each.</p>
                                <div className="form-grid-2">
                                    {[
                                        { name: 'photo', label: 'Passport Photo', accept: 'image/*', required: false },
                                        { name: 'aadhar', label: 'Aadhar Card', accept: 'image/*,.pdf', required: false },
                                        { name: 'tenth_marksheet', label: '10th Marksheet', accept: 'image/*,.pdf', required: false },
                                        { name: 'twelfth_marksheet', label: '12th Marksheet', accept: 'image/*,.pdf', required: false },
                                    ].map((doc) => (
                                        <div key={doc.name} className="form-group">
                                            <label>{doc.label}</label>
                                            <div className="file-upload-wrap">
                                                <input
                                                    type="file"
                                                    id={`file-${doc.name}`}
                                                    name={doc.name}
                                                    accept={doc.accept}
                                                    onChange={handleChange}
                                                    className="file-input"
                                                />
                                                <label htmlFor={`file-${doc.name}`} className="file-label">
                                                    <span className="file-icon">📎</span>
                                                    <span>{form[doc.name] ? form[doc.name].name : 'Choose File'}</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="application-summary">
                                    <h3>Application Summary</h3>
                                    <div className="summary-grid">
                                        <div className="summary-item"><span>Name</span><strong>{form.full_name || '—'}</strong></div>
                                        <div className="summary-item"><span>Mobile</span><strong>{form.mobile || '—'}</strong></div>
                                        <div className="summary-item"><span>Email</span><strong>{form.email || '—'}</strong></div>
                                        <div className="summary-item"><span>12th %</span><strong>{form.twelfth_percentage || '—'}</strong></div>
                                        <div className="summary-item"><span>Course</span><strong>{form.course_preference || '—'}</strong></div>
                                        <div className="summary-item"><span>Quota</span><strong>{form.quota_type || '—'}</strong></div>
                                        {form.college_name && <div className="summary-item"><span>College</span><strong>{form.college_name}</strong></div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Navigation */}
                        <div className="form-actions">
                            {step > 1 && (
                                <button type="button" className="btn-outline" onClick={prevStep}>← Previous</button>
                            )}
                            {step < STEPS.length && (
                                <button type="button" className="btn-dark" onClick={nextStep}>Next →</button>
                            )}
                            {step === STEPS.length && (
                                <button type="submit" className="btn-dark btn-submit" disabled={submitting}>
                                    {submitting ? 'Submitting...' : '🎓 Submit Application'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

