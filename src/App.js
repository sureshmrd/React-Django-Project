import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import CounsellorLogin from './components/CounsellorLogin';
import Home from './components/Home';
import { Display } from './components/Display';
import AdminHome from './components/AdminHome';
import UploadResult from './components/UploadResult';
import UploadCounsellor from './components/UploadCounsellor';
import { CounsellorDisplay } from './components/CounsellorDisplay';
import UploadStudent from './components/UploadStudent';
import Navbar from './components/NavBar';
import StudentLogin from './components/StudentLogin';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
//import { RandomTable } from './components/sample';
import Hod from './components/Hod';


const App = () => {
  return (
    <Router>
      {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/home/uploadResult" element={<UploadResult />} />
        <Route path="/admin/home/uploadCounsellor" element={<UploadCounsellor />} />
        <Route path="/admin/home/uploadStudent" element={<UploadStudent />} />
        <Route path="/counsellor" element={<CounsellorLogin />} />
        <Route path="/counsellor/forgotpassword" element={<ForgotPassword />} />
        <Route path="/counsellor/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/counsellor/:counId" element={<CounsellorDisplay/>} />
        <Route path="/student/:regNo" element={<Display />} />
        <Route path="/student" element={<StudentLogin />} />
        
        <Route path='/hod' element={<Hod/>} />
      </Routes>
    </Router>
  );
};

export default App;