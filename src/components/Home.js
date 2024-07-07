import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import AboutCollege from './AboutCollege';


// Home component for the home page route
const Home = () => {
  const [selectedOption,setSelectedOption]=useState('default');
  const navigate = useNavigate();

  const handleSelectChange=(event)=>{
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
   

    // Navigate to the corresponding route based on the selected option
    switch (selectedValue) {
      case 'student':
        navigate('/student');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'counsellor':
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
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div class="container-fluid">
      
      <a class="navbar-brand" href="">
      <img src="/crreddy_logo.png" alt="crreddy_logo" width="80" height="80"/>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="#about">About Us</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="#about">Contact Us</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href=""
          id="loginDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Login As  {selectedOption === 'default'? '':selectedOption}
          </a>
          <ul class="dropdown-menu">
            <li><a className="dropdown-item" href="" onClick={()=>handleSelectChange({target:{value: 'student'}})}>student</a></li>
            <li><a class="dropdown-item" href="" onClick={()=>handleSelectChange({target:{value: 'admin'}})} >Admin</a></li>
            <li><a class="dropdown-item" href="" onClick={()=>handleSelectChange({target:{value: 'counsellor'}})}>counsellor</a></li>
            <li><a class="dropdown-item" href="" onClick={()=>handleSelectChange({target:{value: 'hod'}})}>hod</a></li>
          </ul>
        </li>
      </ul>
      
    </div>
  </div>
      </nav>
    <div id='img'>
    <img src="/crreddy1.jpg" class="img-fluid" alt="crreddy img"/>
    </div>
    <div>
      <AboutCollege/>
    </div>
    
    </div>

  );
};

export default Home;
