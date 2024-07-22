import './App.css';
import axios from 'axios';

import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadPDF from './components/UploadPDF';
import DoctorPatientLink from './components/DoctorPatientLink';
import NotFound from './components/NotFound';



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null); 


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUrl = 'https://doctor-management-system-backend.vercel.app';

        // const res = await axios.get('/api/v1/auth/check', { withCredentials: true });
        
        const res = await axios.get(`${apiUrl}/api/v1/auth/check`, { withCredentials: true });

        console.log(res);
        console.log(res.data.user);

        if(res.data.user) setUser(res.data.user); 

      } catch (err) {
          if(err.response && err.response.status === 401){
            setUser(null);
          }
          else {
            console.error('Authentication check failed:', err);
          }
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <Router>
        <Header user={user} toggleTheme={toggleTheme} theme={theme} setUser={setUser}/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:user/:token" element={<ResetPassword />} />
          <Route path="/" element={<UploadPDF user={user}/>} />
          <Route path="/doctorPatientLink" element={<DoctorPatientLink user={user}/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
      </Router>
    </>
  );
}

export default App;
