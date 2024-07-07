import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [counsellorId, setCounsellorId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('Sending....');
    let form_data = new FormData();
    form_data.append('counId', counsellorId);

    let url = 'http://localhost:8000/myapi/forgotpassword/';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
    .then(res => {
      setSuccessMessage('Mail sent successfully.');
      setErrorMessage('');
      const token = res.data.token
      console.log(token)
      //navigate('/counsellor/resetpassword/'+token);
    })
    .catch(err => {
      if (err.response && err.response.status === 404) {
        setErrorMessage("Counsellor ID doesn't exist.");
        setSuccessMessage('');
      } else {
        console.error(err);
        setErrorMessage('An error occurred. Please try again.');
        setSuccessMessage('');
      }
    });
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="counsellorId" className="form-label">Counsellor ID:</label>
          <input
            type="text"
            id="counsellorId"
            value={counsellorId}
            onChange={(e) => setCounsellorId(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
