import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="auth-container card">
      <h2>Join MiniReddit</h2>
      {error && <p style={{color: '#DC2626', marginBottom: '1rem', textAlign: 'center'}}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
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
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Register;
