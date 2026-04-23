import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        if (setIsLoggedIn) setIsLoggedIn(true);
        navigate('/');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="auth-container card">
      <h2>Welcome Back</h2>
      {error && <p style={{color: '#DC2626', marginBottom: '1rem', textAlign: 'center'}}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
