import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="about-page-premium">

      {/* Hero */}
      <section className="about-hero-premium">
        <div className="container">
          <div className="about-hero-content fade-up">
            <div className="section-label-premium"><span className="label-dot" />About Us</div>
            <h1>Bridging Dreams to <br /><span className="title-highlight">Distinguished Careers</span></h1>
            <p>Empowering students with expert guidance for engineering and medical admissions across Tamil Nadu since 2024.</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="about-story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content fade-up">
              <h2>Who <span className="title-highlight">We Are</span></h2>
              <p>
                <strong>Mari Educational Trust</strong> is a registered educational consultancy specializing in admission services for engineering and medical programs, including MBBS, primarily in
                Tamil Nadu.
              </p>
              <p>
                We guide students aspiring for engineering and medical courses by providing tailored admission assistance,
                including counseling on college selection, documentation, and logistical support. Leveraging our local expertise
                and networks, we help students navigate competitive exams and gain entry to reputable institutions.
              </p>
              <p>
                In medical admissions, we facilitate placements in both renowned Indian medical colleges and private institutions
                across Tamil Nadu. Operating in Tamil Nadu, we align our services with regional academic requirements to help
                students achieve their professional education goals.
              </p>
            </div>
            <div className="story-visual fade-up">
              <div className="story-image-wrapper card-3d">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="Team collaboration"
                />
                <div className="story-badge">
                  <span>Govt. Registered</span>
                  <strong>MSME</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Impact */}
      <section className="about-values-section premium-3d-wrap">
        <div className="container">
          <div className="values-grid">
            <div className="value-card-modern card-3d fade-up">
              <div className="value-header">
                <div className="value-icon-wrap">🔭</div>
                <h3>Our Vision</h3>
              </div>
              <p>To empower students and institutions by bridging the gap between education and industry, creating a future-ready generation of professionals and innovators.</p>
            </div>

            <div className="value-card-modern card-3d fade-up">
              <div className="value-header">
                <div className="value-icon-wrap">🎯</div>
                <h3>Our Mission</h3>
              </div>
              <ul className="mission-list">
                <li>Guide students in choosing the right academic paths and career opportunities</li>
                <li>Support institutions in curriculum development and research</li>
                <li>Facilitate holistic development through career counseling</li>
                <li>Promote global standards in education</li>
              </ul>
            </div>

            <div className="value-card-modern card-3d fade-up">
              <div className="value-header">
                <div className="value-icon-wrap">🌟</div>
                <h3>Our Impact</h3>
              </div>
              <p>As a registered admission consultancy, we play a vital role in bridging students with suitable engineering and medical colleges, fostering educational growth and professional development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="focus-areas-section">
        <div className="container">
          <div className="section-header-centered fade-up">
            <div className="section-label-premium"><span className="label-dot" />Core Domains</div>
            <h2 className="section-title-premium">Key Focus <span className="title-highlight">Areas</span></h2>
          </div>
          <div className="focus-grid">
            <div className="focus-card fade-up">
              <div className="focus-header">
                <span className="focus-icon">🎓</span>
                <h3>Student Support</h3>
              </div>
              <ul className="focus-list">
                <li>Admissions Guidance</li>
                <li>Career Counseling</li>
                <li>Entrance Exam Assistance</li>
                <li>Application Support</li>
                <li>Internships &amp; Placements</li>
              </ul>
            </div>
            <div className="focus-card fade-up">
              <div className="focus-header">
                <span className="focus-icon">🏛️</span>
                <h3>Institutional Support</h3>
              </div>
              <ul className="focus-list">
                <li>Curriculum Development</li>
                <li>Industry Collaborations</li>
                <li>Research Support</li>
                <li>Infrastructure Enhancement</li>
                <li>Process Improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="success-cta-section">
        <div className="container">
          <div className="cta-premium-inner fade-up">
            <h2>Start Your Success Story Today</h2>
            <p>Join 1000+ students who have achieved their educational dreams with Mari Educational Trust.</p>
            <div className="cta-contact-grid">
              <div className="cta-contact-item">
                <span className="cta-icon">📞</span>
                <div className="cta-text">
                  <strong>Call Us</strong>
                  <span>+91 9843139330 | WhatsApp: 9941489330</span>
                </div>
              </div>
              <div className="cta-contact-item">
                <span className="cta-icon">💬</span>
                <div className="cta-text">
                  <strong>WhatsApp</strong>
                  <span>Chat with us for instant response</span>
                </div>
              </div>
              <div className="cta-contact-item">
                <span className="cta-icon">📍</span>
                <div className="cta-text">
                  <strong>Visit Us</strong>
                  <span>Alathur, Perambalur, Tamil Nadu</span>
                </div>
              </div>
            </div>
            <Link to="/contact" className="btn-cta-premium">Get Free Consultation</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
