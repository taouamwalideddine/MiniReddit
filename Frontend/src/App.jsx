import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav>
        <h2>Mini Reddit</h2>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<div>Home Page (Posts will go here)</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/register" element={<div>Register Page</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
