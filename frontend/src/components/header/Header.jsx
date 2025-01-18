import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './Header.css';

function Header() {
  // This would normally come from your auth context/state management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('John Doe');

  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo/Brand Name */}
        <div className="logo">
          <h1>Transriptor</h1>
        </div>

        {/* Navigation Buttons */}
        <nav className="nav-buttons">
          {!isLoggedIn ? (
            <>
              <button className="btn btn-ghost" onClick={()=>navigate('/auth')}>Sign In</button>
              <button className="btn btn-primary" onClick={()=>navigate('/auth')}>Register</button>
            </>
          ) : (
            <div className="profile-section">
              <span className="username">{userName}</span>
              <button className="btn btn-ghost" onClick={()=>navigate('/profile')}>
                <svg 
                  className="profile-icon" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header