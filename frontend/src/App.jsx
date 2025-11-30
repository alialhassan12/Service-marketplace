import AOS from 'aos';
import {Routes,Route,Navigate} from 'react-router-dom';
import "@radix-ui/themes/styles.css";

//components
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
function App() {
  const {check,authUser}=useAuthStore();
    useEffect(()=>{
      check();
    },[check]);

  //intialize aos for the fade animation
    AOS.init({
      duration:1000
    });

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={authUser?<Navigate to="/"/>:<LoginPage/>}/>
        <Route path="/register" element={authUser?<Navigate to="/"/>:<RegisterPage/>}/>
      </Routes>
    </>
  )
}

export default App
