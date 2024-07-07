import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginDesign.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === '1234') {
      // Navigate to admin dashboard or desired page
      navigate('/admin/home');
    } else {
      // Show error message or handle authentication failure
      alert('Invalid username or password');
    }
  };

  return (
    <div className="background">
            <div className="login-form">
              <h2 id='form-heading'>Admin Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
              </form>
            </div>
          </div>
  );
};

export default AdminLogin;
