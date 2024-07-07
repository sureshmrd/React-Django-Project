import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginDesign.css';

const CounsellorLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send a POST request to the backend with the username and password
      const response = await axios.post('http://localhost:8000/myapi/login/', {
        username,
        password
      });
      console.log(response)
      // If login is successful, redirect the user to another page
      navigate('/counsellor/'+username); // Replace with your desired URL
    } catch (error) {
      // If login fails, display the error message
      alert('Invalid username or password');
    }
  };

  const handleForgotPassword = () => {
    // Add logic for forgot password functionality here
    navigate('/counsellor/forgotpassword')
  };

  return (
    <div className="background">
            <div className="login-form">
              <h2 className="heading">Counsellor Login</h2>
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
                <button type="button" className="btn btn-link" onClick={handleForgotPassword}>Forgot Password</button>
              </form>
            </div>
          </div>
  );
};

export default CounsellorLogin;
