import React from 'react';
import { Link } from 'react-router-dom';

// Home component for the home page route
const AdminHome = () => {
  return (
    <div className="container mt-5">
      <h1>Welcome, Admin</h1>
      <div className="list-group">
        <Link to="/admin/home/uploadResult" className="list-group-item list-group-item-action">Upload Results</Link>
        <Link to="/admin/home/uploadCounsellor" className="list-group-item list-group-item-action">Upload Counsellor</Link>
        <Link to="/admin/home/uploadStudent" className="list-group-item list-group-item-action">Upload Student</Link>
      </div>
    </div>
  );
};

export default AdminHome;
