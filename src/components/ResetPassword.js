import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
  
    // Send request to reset password
    try {
      const response = await axios.post(`http://localhost:8000/myapi/resetpassword/${token}/`, {
        new_password: newPassword // Send new_password in the request body
      });
      // Reset form and display success message if request is successful
      console.log(response);
      setNewPassword('');
      setConfirmPassword('');
      alert('Password reset successful.');
    } catch (error) {
      // Display error message if request fails
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default ResetPassword;
