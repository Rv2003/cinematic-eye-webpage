import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import './navbar.css';
import axios from 'axios';

export function Navbar({ user, setUser, token, setToken }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
 
  useEffect(()=>{
console.log('wens una huthth')
  },[])

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

async function handleLogout() {
  try {
    await axios.post('http://localhost:5500/api/v1/auth/sign-out', {}, { withCredentials: true });
  } catch (error) {
    console.error('Sign-out request failed:', error);
  } finally {
    setUser(null);
    setToken(null);
    navigate('/');
  }
}

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-active' : ''}`}>
        <div className="navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="nav-brand" onClick={closeMenu}>
            <span className="brand-light">CINEMATIC</span>
            <span className="brand-dot"></span>
            <span className="brand-bold">EYE</span>
          </Link>

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
                
                  <li style={{ '--index': 5 }}>
        
                  <Link to={user?('/booking'):('/login')} className="nav-link" onClick={closeMenu}>
                    <span className="nav-link-inner">
                      <span className="nav-link-text" style={{ color: 'var(--accent)' }}>Book Session</span>
                      <span className="nav-link-text hover-text" style={{ color: 'var(--accent)' }}>Book Session</span>
                    </span>
                  </Link>
                </li>
            
              </ul>
            </div>
          </div>

  
          <div className="nav-right">
            {user ? (
              <Link to="/" className="nav-login" onClick={handleLogout}>
                <span>Logout</span>
              </Link>
            ) : (
              <Link to="/login" className="nav-login" onClick={closeMenu}>
                <span>Login</span>
              </Link>
            )}
          </div>
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
    </>
  );
}