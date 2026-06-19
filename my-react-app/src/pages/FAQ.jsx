import { useState, useEffect } from 'react';

const FAQS = [
  {
    category: 'Admissions',
    items: [
      { q: 'What documents are required for admission?', a: 'You will need your 10th & 12th marksheets, Aadhar card, passport-sized photos, and entrance exam scorecard (if applicable). Our counselors will guide you through the complete checklist.' },
      { q: 'How does the admission process work?', a: 'Our process is simple: (1) Contact us for a free consultation, (2) We analyze your profile and suggest colleges, (3) We help with documentation, (4) We follow up until your admission is confirmed.' },
      { q: 'Can I apply for multiple colleges at once?', a: 'Yes! We help you apply to multiple colleges simultaneously to maximize your chances of getting into your preferred institution.' },
      { q: 'What is the last date to apply?', a: 'Admission dates vary by college and course. Contact us immediately as seats are limited and admission seasons close quickly. We recommend applying early for best results.' },
    ],
  },
  {
    category: 'Courses & Colleges',
    items: [
      { q: 'Which courses do you offer admission guidance for?', a: 'We provide guidance for Engineering, Medical (MBBS), Nursing, Allied Health Sciences, Arts & Science, Polytechnic/Diploma, Law, Architecture, MBA, MCA, and Pharmacy programs.' },
      { q: 'Are the colleges affiliated and recognized?', a: 'Yes. All colleges in our network are affiliated with recognized universities (Anna University, Tamil Nadu Dr. MGR Medical University, etc.) and approved by AICTE/MCI/UGC.' },
      { q: 'Do you help with management quota seats?', a: 'Yes, we assist with management quota, government quota, NRI quota, and special quota admissions across all our branch colleges.' },
    ],
  },
  {
    category: 'Scholarships',
    items: [
      { q: 'What scholarships are available?', a: 'Students can avail merit-based scholarships (₹5,000–₹25,000), government scholarships (BC/MBC/SC/ST), and special scholarships for top entrance exam scorers.' },
      { q: 'How do I apply for a scholarship?', a: 'Fill out our scholarship application form or contact us directly. We will evaluate your eligibility and guide you through the application process.' },
      { q: 'Can I get a scholarship even with low marks?', a: 'Scholarships are available for various criteria — not just marks. Financial need, sports achievements, and special categories also qualify. Talk to our counselors to explore your options.' },
    ],
  },
  {
    category: 'Fees & Support',
    items: [
      { q: 'Is your consultation service free?', a: 'Yes! Our initial consultation is completely free. We are committed to helping students get into the right college without any hidden charges.' },
      { q: 'Do you offer support after admission?', a: 'Absolutely. We support students even after admission — from hostel arrangements to handling any issues with the college.' },
      { q: 'What are your office hours?', a: 'We are available Monday to Saturday, 9 AM to 6 PM. You can also reach us on WhatsApp (9941489330) for quick queries anytime.' },
    ],
  },
];

export default function FAQ() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [openMap, setOpenMap] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const toggle = (cat, i) => {
    setOpenMap((prev) => ({ ...prev, [`${cat}-${i}`]: !prev[`${cat}-${i}`] }));
  };

  return (
    <div className="faq-page">
      {/* Hero */}
      <section className="faq-hero">
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="faq-hero-content">
            <div className="section-label-premium"><span className="label-dot" />Help Center</div>
            <h1>Frequently Asked <span className="title-highlight">Questions</span></h1>
            <p>Find answers to common questions about admissions, courses, scholarships, and more.</p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-section">
        <div className="container">
          {/* Tabs */}
          <div className="faq-tabs">
            {FAQS.map((cat, i) => (
              <button
                key={i}
                className={`faq-tab${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="faq-list">
            {FAQS[activeTab].items.map((item, i) => {
              const key = `${activeTab}-${i}`;
              const open = !!openMap[key];
              return (
                <div key={i} className={`faq-item card-3d${open ? ' open' : ''}`}>
                  <button className="faq-question" onClick={() => toggle(activeTab, i)}>
                    <span>{item.q}</span>
                    <span className="faq-chevron">{open ? '−' : '+'}</span>
                  </button>
                  {open && (
                    <div className="faq-answer">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still have questions CTA */}
          <div className="faq-cta-box">
            <h3>Still have questions?</h3>
            <p>Our expert counselors are ready to help you personally.</p>
            <div className="faq-cta-buttons">
              <a href="tel:+919843139330" className="btn-dark">📞 Call Us Now</a>
              <a href="https://wa.me/919941489330" className="btn-whatsapp" target="_blank" rel="noreferrer">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
