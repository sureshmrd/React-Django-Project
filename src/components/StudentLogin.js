import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import  './LoginDesign.css';

const StudentLogin = () => {
  const [regNo, setRegNo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return <Navigate to={`/student/${regNo}`} />;
  }

  return (
    <div className="background">
        <div className='login-form'>
      <h2 id='form-heading'>Enter Register No</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <input 
            type="text" 
            value={regNo} 
            onChange={(e) => setRegNo(e.target.value)} 
            placeholder="eg:20HK5A0309..." 
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      </div>
      </div>
  );
};

export default StudentLogin;
