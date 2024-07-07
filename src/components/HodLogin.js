import React, { useState } from 'react';
import './LoginDesign.css';

const HodLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    //Here you can perform authentication logic, e.g., calling an API to validate the credentials
    // For simplicity, let's assume authentication is successful if the username is "hod" and password is "password"
    if (username === 'hod' && password === '1234') {
      onLogin(username); // Pass the username to the parent component
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className='background'>
      <div className='login-form'>
      <h2 className='heading'> HOD Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='form-group'>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
};

export default HodLogin;