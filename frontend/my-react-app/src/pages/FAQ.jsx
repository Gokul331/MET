import { useState, useEffect } from 'react';
import PageTransition from '../components/common/PageTransition';
import { AnimatePresence, motion } from 'framer-motion';

const FAQS = [
  {
    category: 'Admissions',
    items: [
      {
        q: 'What documents are required for admission?',
        a: 'You will need your 10th & 12th mark sheets, Aadhar card, passport-sized photographs, and entrance exam scorecard (if applicable). Our counsellors will guide you through the complete checklist.',
      },
      {
        q: 'How does the admission process work?',
        a: 'Our process has four clear steps: (1) Free consultation — we understand your goals, (2) Profile analysis — we match you with the best colleges, (3) Documentation support — we handle the paperwork, (4) Admission confirmation — we follow up until your seat is secured.',
      },
      {
        q: 'Can I apply for multiple colleges at once?',
        a: 'Yes! We help you apply to multiple colleges simultaneously to maximise your chances of admission into your preferred institution.',
      },
      {
        q: 'What is the last date to apply?',
        a: 'Admission dates vary by college and course. Contact us immediately as seats are limited and admission seasons close quickly. We recommend applying early for the best outcome.',
      },
    ],
  },
  {
    category: 'Courses & Colleges',
    items: [
      {
        q: 'Which courses do you offer admission guidance for?',
        a: 'We provide guidance for Engineering, Medical (MBBS), Nursing, Allied Health Sciences, Arts & Science, Polytechnic/Diploma, Law, Architecture, MBA, MCA, and Pharmacy programs.',
      },
      {
        q: 'Are the colleges affiliated and recognised?',
        a: 'Yes. All colleges in our network are affiliated with recognised universities (Anna University, Tamil Nadu Dr. MGR Medical University, etc.) and approved by AICTE/MCI/UGC.',
      },
      {
        q: 'Do you help with management quota seats?',
        a: 'Yes, we assist with management quota, government quota, NRI quota, and special quota admissions across all our branch colleges.',
      },
    ],
  },
  {
    category: 'Scholarships',
    items: [
      {
        q: 'What scholarships are available?',
        a: 'Students can avail merit-based scholarships (₹5,000–₹25,000), government scholarships (BC/MBC/SC/ST), and special scholarships for top entrance exam scorers.',
      },
      {
        q: 'How do I apply for a scholarship?',
        a: 'Fill our scholarship form or contact us directly. We will evaluate your eligibility and guide you through the entire application process.',
      },
      {
        q: 'Can I get a scholarship even with low marks?',
        a: 'Scholarships cover various criteria beyond academics — financial need, sports achievements, and special categories all qualify. Talk to our counsellors to explore your options.',
      },
    ],
  },
  {
    category: 'Fees & Support',
    items: [
      {
        q: 'Is your consultation service free?',
        a: 'Yes! Our initial consultation is completely free. We are committed to helping students choose the right college without any hidden charges.',
      },
      {
        q: 'Do you offer support after admission?',
        a: 'Absolutely. We support students even after admission — from hostel arrangements to addressing any issues with the college.',
      },
      {
        q: 'What are your office hours?',
        a: 'We are available Monday to Saturday, 9 AM to 6 PM. You can also reach us on WhatsApp (9941489330) for quick queries anytime.',
      },
    ],
  },
];

export default function FAQ() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [openMap, setOpenMap] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const toggle = (cat, i) => {
    setOpenMap(prev => ({ ...prev, [`${cat}-${i}`]: !prev[`${cat}-${i}`] }));
  };

  return (
    <PageTransition>
      <div className="faq-page">

      {/* ── Hero ── */}
      <section className="faq-hero">
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="faq-hero-content fade-up">
            <div className="section-label-premium">
              <span className="label-dot" /> Help Centre
            </div>
            <h1>
              Frequently Asked <span className="title-highlight">Questions</span>
            </h1>
            <p style={{ marginTop: 14, maxWidth: 520, fontSize: '1.05rem', lineHeight: 1.78 }}>
              Find answers to common questions about admissions, courses,
              scholarships, and our guidance process.
            </p>
          </div>
        </div>
      </section>


      {/* ── FAQ Content ── */}
      <section className="faq-section">
        <div className="container">

          {/* Category tabs */}
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

          {/* FAQ accordion */}
          <div className="faq-list">
            {FAQS[activeTab].items.map((item, i) => {
              const key = `${activeTab}-${i}`;
              const open = !!openMap[key];
              return (
                <div key={i} className={`faq-item${open ? ' open' : ''}`}>
                  <button className="faq-question" onClick={() => toggle(activeTab, i)}>
                    <span>{item.q}</span>
                    <span className="faq-chevron">{open ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="faq-answer">
                          <p>{item.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Still have questions */}
          <div className="faq-cta-box">
            <div className="section-label-premium" style={{ justifyContent: 'center', marginBottom: 14 }}>
              <span className="label-dot" /> Still Need Help?
            </div>
            <h3>Can't find what you're looking for?</h3>
            <p>Our expert counsellors are ready to help you personally — for free.</p>
            <div className="faq-cta-buttons">
              <a href="tel:+919843139330" className="btn-primary">
                📞 Call Us Now
              </a>
              <a
                href="https://wa.me/919941489330"
                className="btn-whatsapp"
                target="_blank"
                rel="noreferrer"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>

      </div>
    </PageTransition>
  );
}
