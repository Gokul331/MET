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
    { to: '/colleges', label: 'Colleges' },
    { to: '/courses', label: 'Courses' },

    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav
      className={isScrolled ? 'glass py-3' : 'glass py-5'}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="navbar-brand-link">
          <div className="navbar-logo-container">
            <img src={logoImg} alt="MET Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div className="navbar-brand-title">
              Mari <span>Educational Trust</span>
            </div>
            <div className="navbar-brand-subtitle">
              "பிச்சை புகினும் கற்கை நன்றே"
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={({ isActive }) => ({
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
                color: isActive ? 'var(--blue-primary)' : 'var(--text-muted)',
                background: isActive ? 'rgba(11,79,145,0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(11,79,145,0.12)' : '1px solid transparent',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/apply"
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, var(--blue-primary), var(--blue-dark))',
              color: '#fff',
              borderRadius: 50,
              fontWeight: 600,
              fontSize: '0.88rem',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(11,79,145,0.2)',
              transition: 'all 0.3s',
            }}
          >
            Apply Now
          </Link>

        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '10px',
            borderRadius: 10,
            background: 'rgba(11,79,145,0.05)',
            border: '1px solid rgba(11,79,145,0.12)',
            color: 'var(--blue-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          className="lg:hidden"
          id="mobile-menu-toggle"
        >
          {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setIsOpen(false)}
                style={({ isActive }) => ({
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: isActive ? 'var(--blue-primary)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(11,79,145,0.06)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--blue-primary)' : '3px solid transparent',
                })}
              >
                {link.label}
              </NavLink>
            ))}

            <div style={{ paddingTop: 12, marginTop: 8, borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link
                to="/apply"
                onClick={() => setIsOpen(false)}
                style={{ padding: '12px 16px', background: 'linear-gradient(135deg,var(--blue-primary),var(--blue-dark))', color: '#fff', borderRadius: 10, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}
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