import { useState, useEffect } from 'react';
import { Link } from 'react-router'
import './navbar.css';


export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-active' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <a href="#" className="nav-brand" onClick={closeMenu}>
          <span className="brand-light">CINEMATIC</span>
          <span className="brand-dot"></span>
          <span className="brand-bold">EYE</span>
        </a>

       
        <div className={`nav-menu-wrapper ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-dock">
            <ul className="nav-links">
              <li style={{ '--index': 1 }}>
                <a href="#home" className="nav-link" onClick={closeMenu}>
                  <span className="nav-link-inner">
                    <span className="nav-link-text">Home</span>
                    <span className="nav-link-text hover-text">Home</span>
                  </span>
                </a>
              </li>
              <li style={{ '--index': 2 }}>
                <a href="#work" className="nav-link" onClick={closeMenu}>
                  <span className="nav-link-inner">
                    <span className="nav-link-text">Work</span>
                    <span className="nav-link-text hover-text">Work</span>
                  </span>
                </a>
              </li>
              <li style={{ '--index': 3 }}>
                <a href="#about" className="nav-link" onClick={closeMenu}>
                  <span className="nav-link-inner">
                    <span className="nav-link-text">About</span>
                    <span className="nav-link-text hover-text">About</span>
                  </span>
                </a>
              </li>
              <li style={{ '--index': 4 }}>
                <a href="#contact" className="nav-link" onClick={closeMenu}>
                  <span className="nav-link-inner">
                    <span className="nav-link-text">Contact</span>
                    <span className="nav-link-text hover-text">Contact</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <Link to="/login" className="nav-login" onClick={closeMenu}>
          <span>Login</span>
        </Link>

        {/* Hamburger Menu Toggle */}
        <button
          className="nav-toggle-btn"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <div className="hamburger-box">
            <span className="hamburger-line top"></span>
            <span className="hamburger-line mid"></span>
            <span className="hamburger-line bot"></span>
          </div>
        </button>
      </div>
    </nav>
  );
}