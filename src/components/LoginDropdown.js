import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginDropdown = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);

    // Navigate to the corresponding route based on the selected option
    switch (selectedValue) {
      case 'student':
        navigate('/student');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'counselor':
        navigate('/counsellor');
        break;
      case 'hod':
        navigate('/hod');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <div className="mt-3">
      <label htmlFor="login" className="form-label">Login As:</label>
      <select id="login" value={selectedOption} onChange={handleSelectChange} className="form-select">
        <option value="default">...</option>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
        <option value="counselor">Counsellor</option>
        <option value="hod">Hod</option>
      </select>
    </div>
  );
};

export default LoginDropdown;
