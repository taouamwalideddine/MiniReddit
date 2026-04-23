import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount and when route changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">
            <span className="brand-icon">🔥</span>
            <h2>MiniReddit</h2>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-item">Home</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/register" className="nav-item btn-primary">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
