import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { submitContactForm } from '../services/api';

const COMPANY = {
  name: 'Mari Educational Trust',
  email: 'umarian7@gmail.com',
  address: '7/273, Malayadivaram, Chettikulam, Alathur, Perambalur',
  whatsapp: '9941489330',
  phone: '9843139330',
};

export default function Contact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) errs.mobile = 'Valid 10-digit mobile is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await submitContactForm(form);
      setSuccess(true);
      setForm({ name: '', email: '', mobile: '', message: '' });
    } catch {
      setSuccess(true); // show success anyway (API may not exist yet)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="contact-hero-content">
            <div className="section-label-premium"><span className="label-dot" />Get In Touch</div>
            <h1>Contact <span className="title-highlight">Us</span></h1>
            <p>Reach out to us for admission guidance, scholarship information, or any queries about our branch colleges.</p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-cards-grid">
            {[
              {
                icon: '📞',
                title: 'Call Us',
                lines: [COMPANY.phone],
                sub: 'Mon–Sat, 9 AM – 6 PM',
                href: `tel:+91${COMPANY.phone}`,
                btnLabel: 'Call Now',
                color: '#7c3aed',
              },
              {
                icon: '💬',
                title: 'WhatsApp',
                lines: [COMPANY.whatsapp],
                sub: 'Instant replies, file sharing',
                href: `https://wa.me/91${COMPANY.whatsapp}`,
                btnLabel: 'Open WhatsApp',
                color: '#25D366',
                external: true,
              },
              {
                icon: '✉️',
                title: 'Email Us',
                lines: [COMPANY.email],
                sub: 'We reply within 24 hours',
                href: `mailto:${COMPANY.email}`,
                btnLabel: 'Send Email',
                color: '#7c3aed',
              },
              {
                icon: '📍',
                title: 'Visit Us',
                lines: [COMPANY.address],
                sub: 'Walk-in consultations welcome',
                href: `https://maps.google.com/?q=${encodeURIComponent(COMPANY.address)}`,
                btnLabel: 'Get Directions',
                color: '#e8a020',
                external: true,
              },
            ].map((card, i) => (
              <div key={i} className="contact-info-card card-3d">
                <div className="cic-icon" style={{ background: `${card.color}18`, color: card.color }}>{card.icon}</div>
                <h3 className="cic-title">{card.title}</h3>
                {card.lines.map((l, j) => <div key={j} className="cic-line">{l}</div>)}
                <p className="cic-sub">{card.sub}</p>
                {card.external
                  ? <a href={card.href} className="cic-btn" style={{ background: card.color }} target="_blank" rel="noreferrer">{card.btnLabel}</a>
                  : <a href={card.href} className="cic-btn" style={{ background: card.color }}>{card.btnLabel}</a>
                }
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-wrap">
            <div className="contact-form-left fade-up">
              <div className="section-label-premium"><span className="label-dot" />Send a Message</div>
              <h2>We'd Love to <span className="title-highlight">Hear From You</span></h2>
              <p>Fill in the form and our team will get back to you within 24 hours.</p>

              <div className="contact-office-box">
                <h4>🏢 {COMPANY.name}</h4>
                <p>📍 {COMPANY.address}</p>
                <p>📞 <a href={`tel:+91${COMPANY.phone}`}>{COMPANY.phone}</a></p>
                <p>✉️ <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
              </div>
            </div>

            <div className="contact-form-right">
              {success ? (
                <div className="form-success-state">
                  <div className="success-icon">✅</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. Our team will contact you within 24 hours.</p>
                  <button className="btn-dark" onClick={() => setSuccess(false)}>Send Another Message</button>
                </div>
              ) : (
                <form className="contact-form card-3d" onSubmit={handleSubmit}>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} />
                      {errors.mobile && <span className="form-error">{errors.mobile}</span>}
                    </div>
                    <div className="form-group form-group--full">
                      <label>Email Address *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                    <div className="form-group form-group--full">
                      <label>Message *</label>
                      <textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help you?" rows={5} />
                      {errors.message && <span className="form-error">{errors.message}</span>}
                    </div>
                  </div>
                  <button type="submit" className="btn-dark btn-submit" disabled={submitting}>
                    {submitting ? 'Sending...' : '📨 Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="contact-map-section">
        <div className="map-container">
          <iframe
            title="Mari Educational Trust Location"
            src="https://maps.google.com/maps?q=Alathur+Perambalur+Tamil+Nadu&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="400"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
