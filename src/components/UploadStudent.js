import React, { useState } from 'react';
import axios from 'axios';

const UploadStudent = () => {
  const [formData, setFormData] = useState({
    pdf: null
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePdfChange = (e) => {
    setFormData({
      ...formData,
      pdf: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('Uploading....');
    let form_data = new FormData();
    form_data.append('pdf', formData.pdf, formData.pdf.name);
    form_data.append('name', 'Student');
    form_data.append('pdfName', formData.pdf.name);
    
    let url = 'http://localhost:8000/myapi/upload/';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
    .then(res => {
      setErrorMessage('');
      setSuccessMessage('Uploaded Successfully');
      console.log("then", res.data);
    })
    .catch(err => {
      setSuccessMessage('');
      setErrorMessage('Error Uploading');
      console.log(err);
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <div className="alert ">Note: make sure to upload the Counsellor data first</div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="pdf" className="form-label">Upload PDF:</label>
              <input type="file" id="pdf" accept=".xls,.xlsx" onChange={handlePdfChange} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary">Upload</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadStudent;
