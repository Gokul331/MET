import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import logoImg from '../../assets/Logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/colleges', label: 'Colleges' },
    { to: '/courses', label: 'Courses' },
    { to: '/contact', label: 'Contact' },
  ]


  return (
    <nav
      className={isScrolled ? 'glass py-3' : 'glass py-5'}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}
    >
      <div className="container-custom flex items-center justify-between">

        {/* ── Brand ── */}
        <Link to="/" className="navbar-brand-link">
          <div className="navbar-logo-container">
            <img
              src={logoImg}
              alt="MET Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div className="navbar-brand-title">
              Mari <span>Educational Trust</span>
            </div>
            <div className="navbar-brand-subtitle">"பிச்சை புகினும் கற்கை நன்றே!"</div>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={({ isActive }) => ({
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: '0.86rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.22s',
                color: isActive ? '#2563eb' : '#64748b',
                background: isActive ? '#eff6ff' : 'transparent',
                border: isActive ? '1px solid #dbeafe' : '1px solid transparent',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* ── Desktop CTA ── */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+919843139330"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 8,
              background: '#eff6ff',
              border: '1px solid #dbeafe',
              color: '#2563eb',
              fontSize: '0.83rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.22s',
            }}
          >
            📞 9843139330
          </a>
          <Link
            to="/apply"
            style={{
              padding: '9px 22px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: '0.86rem',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            Apply Now →
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="mobile-menu-toggle"
          className="lg:hidden"
          style={{
            padding: 10,
            borderRadius: 10,
            background: '#eff6ff',
            border: '1px solid #dbeafe',
            color: '#2563eb',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* ── Mobile Dropdown ── */}
      {isOpen && (
        <div className="mobile-menu-dropdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setIsOpen(false)}
                style={({ isActive }) => ({
                  padding: '11px 16px',
                  borderRadius: 10,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: isActive ? '#2563eb' : '#64748b',
                  background: isActive ? '#eff6ff' : 'transparent',
                  borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
                  transition: 'all 0.2s',
                })}
              >
                {link.label}
              </NavLink>
            ))}

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a
                href="tel:+919843139330"
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '11px 16px',
                  background: '#eff6ff',
                  border: '1px solid #dbeafe',
                  color: '#2563eb',
                  borderRadius: 10,
                  fontWeight: 700,
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                }}
              >
                📞 Call: 9843139330
              </a>
              <Link
                to="/apply"
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff',
                  borderRadius: 10,
                  fontWeight: 700,
                  textDecoration: 'none',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(37,99,235,0.2)',
                }}
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar