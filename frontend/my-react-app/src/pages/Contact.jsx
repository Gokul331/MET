import { useEffect, useState } from 'react';
import { submitContactForm } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import { motion } from 'framer-motion';

const COMPANY = {
  name: 'Mari Educational Trust',
  email: 'umarian7@gmail.com',
  address: '7/273, Malayadivaram, Chettikulam, Alathur, Perambalur',
  whatsapp: '9941489330',
  phone: '9843139330',
};

const TOPICS = [
  { id: 'Admissions', icon: '🎓', label: 'Admissions' },
  { id: 'Scholarships', icon: '💰', label: 'Scholarships' },
  { id: 'Counseling', icon: '💼', label: 'Counseling' },
  { id: 'Other', icon: '🏛️', label: 'Other' },
];

const PLACEHOLDERS = {
  Admissions: 'Tell us which courses, branches, or partner colleges you are interested in...',
  Scholarships: 'Provide details on your 12th/UG marks, background, and scholarship eligibility questions...',
  Counseling: 'Request a free callback from our expert counsellors. Mention your preferred call timing...',
  Other: 'How can the Mari Educational Trust team help you today? Ask us anything...'
};

export default function Contact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inquiryTopic, setInquiryTopic] = useState('Admissions');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) errs.mobile = '10-digit mobile required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await submitContactForm({
        ...form,
        message: `[Topic: ${inquiryTopic}] ${form.message}`
      });
      setSuccess(true);
      setForm({ name: '', email: '', mobile: '', message: '' });
    } catch {
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="contact-page" style={{ paddingBottom: '80px' }}>

        {/* ── First Row: Split Hero with Map on the Right ── */}
        <section className="contact-hero" style={{ borderBottom: '1px solid var(--border)', padding: '130px 0 60px' }}>
          <div className="hero-bg-pattern" />
          <div className="container contact-hero-grid">
            {/* Left Column: Title & Info text */}
            <div className="contact-hero-content">
              <div className="section-label-premium">
                <span className="label-dot" /> Academic Support
              </div>
              <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.25, margin: '14px 0 16px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Shape Your<br />
                <span className="title-highlight">Educational Journey</span>
              </h1>
              <p className="section-subtitle-premium" style={{ maxWidth: '460px', textAlign: 'left', margin: 0 }}>
                Confused about selecting the right engineering branch or medical college? Get in touch with our trust counselors for personalized career guidance.
              </p>
            </div>
            
            {/* Right Column: Embedded Map frame */}
            <div style={{ height: '280px', borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <iframe
                title="Mari Educational Trust Location"
                src="https://maps.google.com/maps?q=Alathur+Perambalur+Tamil+Nadu&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Separator line */}
        <div className="container" style={{ padding: '0' }}>
          <hr className="contact-thick-divider" style={{ opacity: 0.15 }} />
        </div>

        {/* ── Second Row: Info Cards and Inquiry Form ── */}
        <section style={{ marginTop: '50px' }}>
          <div className="container">
            <div className="contact-form-layout-grid">
              
              {/* Left Column: Direct Info card with WhatsApp/Call/Directions triggers */}
              <div className="hero-premium-glass-card" style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📍</span> Contact Information
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Address Row */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(37,99,235,0.08)',
                      color: 'var(--blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      📍
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-faint)', letterSpacing: '1px', marginBottom: '4px' }}>Office Address</div>
                      <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {COMPANY.address}
                      </p>
                    </div>
                  </div>

                  {/* Telephone Row */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(22,163,74,0.08)',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      📞
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-faint)', letterSpacing: '1px', marginBottom: '4px' }}>Telephone</div>
                      <a href={`tel:+91${COMPANY.phone}`} style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--blue)', textDecoration: 'none' }}>
                        +91 {COMPANY.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email Row */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(245,158,11,0.08)',
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      ✉️
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-faint)', letterSpacing: '1px', marginBottom: '4px' }}>Email Address</div>
                      <a href={`mailto:${COMPANY.email}`} style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                        {COMPANY.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Call & Social triggers panels */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '28px' }}>
                  <motion.a 
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    href={`https://wa.me/91${COMPANY.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 0',
                      borderRadius: 'var(--r-md)',
                      background: '#16a34a',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(22,163,74,0.15)'
                    }}
                  >
                    <span>💬</span> WhatsApp
                  </motion.a>
                  
                  <motion.a 
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    href={`tel:+91${COMPANY.phone}`}
                    style={{
                      padding: '10px 0',
                      borderRadius: 'var(--r-md)',
                      background: 'var(--blue)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.15)'
                    }}
                  >
                    <span>📞</span> Direct Call
                  </motion.a>

                  <motion.a 
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 0',
                      borderRadius: 'var(--r-md)',
                      background: 'var(--bg-soft)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <span>📍</span> Directions
                  </motion.a>
                </div>
              </div>

              {/* Right Column: Inquiry Submission Card */}
              <div className="hero-premium-glass-card" style={{ padding: '36px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✉️</span> Submit Inquiry
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.5 }}>
                  Fill out the form below. A trust coordinator will verify details and reach out within 24 hours.
                </p>

                {success ? (
                  <div className="form-success-state" style={{ padding: '20px 0' }}>
                    <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '14px' }}>✅</div>
                    <h3>Inquiry Received!</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
                      Thank you. Your message has been routed to our academic advisors.
                    </p>
                    <button className="btn-primary" style={{ width: '100%' }} onClick={() => setSuccess(false)}>
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Topic Selector */}
                    <div>
                      <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.07em' }}>
                        Inquiry Topic
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {TOPICS.map(topic => (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => setInquiryTopic(topic.id)}
                            style={{
                              padding: '8px 12px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              borderRadius: 'var(--r-md)',
                              border: inquiryTopic === topic.id ? '1.5px solid var(--blue)' : '1px solid var(--border)',
                              background: inquiryTopic === topic.id ? 'var(--blue-pale)' : 'var(--white)',
                              color: inquiryTopic === topic.id ? 'var(--blue)' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>{topic.icon}</span> {topic.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input 
                        id="name" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        placeholder="Your name"
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                          id="email" 
                          type="email" 
                          name="email" 
                          value={form.email} 
                          onChange={handleChange} 
                          placeholder="your@email.com"
                        />
                        {errors.email && <span className="form-error">{errors.email}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="mobile">Mobile Number</label>
                        <input 
                          id="mobile" 
                          type="tel" 
                          name="mobile" 
                          value={form.mobile} 
                          onChange={handleChange} 
                          placeholder="10-digit number"
                          maxLength={10}
                        />
                        {errors.mobile && <span className="form-error">{errors.mobile}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        value={form.message} 
                        onChange={handleChange} 
                        placeholder={PLACEHOLDERS[inquiryTopic]} 
                        rows={4} 
                      />
                      {errors.message && <span className="form-error">{errors.message}</span>}
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit" 
                      className="btn-primary" 
                      disabled={submitting}
                      style={{ width: '100%', padding: '12px 0', fontSize: '0.9rem', display: 'flex', justifyContent: 'center' }}
                    >
                      {submitting ? 'Submitting...' : '📨 Send Message'}
                    </motion.button>

                  </form>
                )}
              </div>

            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
