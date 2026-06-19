import { Link } from 'react-router-dom';

const COMPANY = {
  name: 'Mari Educational Trust',
  email: 'umarian7@gmail.com',
  address: '7/273, Malayadivaram, Chettikulam, Alathur, Perambalur',
  whatsapp: '9941489330',
  phone: '9843139330',
};

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="5" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const YouTubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);
const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-premium">
      <div className="footer-bg-pattern" />
      <div className="container">
        <div className="footer-premium-grid">
          {/* Brand */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-main">MARI EDUCATIONAL TRUST</span>
            </Link>
            <p className="footer-description">
              Empowering students to achieve their academic dreams through personalized guidance,
              scholarship support, and expert admission strategies across Tamil Nadu.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><InstagramIcon /></a>
              <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FacebookIcon /></a>
              <a href="#" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><YouTubeIcon /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/colleges">Our Colleges</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/scholarship">Scholarships</Link></li>
              <li><Link to="/applications">My Applications</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-links-col">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/apply">Apply Now</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact-col">
            <h4>Contact Info</h4>
            <div className="footer-contact-info">
              <p>
                <LocationIcon />
                <span>{COMPANY.address}</span>
              </p>
              <p>
                <EmailIcon />
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </p>
              <p>
                <PhoneIcon />
                <a href={`tel:+91${COMPANY.phone}`}>{COMPANY.phone}</a>
              </p>
              <p>
                <PhoneIcon />
                <a href={`https://wa.me/91${COMPANY.whatsapp}`} target="_blank" rel="noreferrer">
                  WhatsApp: {COMPANY.whatsapp}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {year} {COMPANY.name}. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
