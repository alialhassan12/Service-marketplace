import AOS from 'aos';
import {Routes,Route,Navigate} from 'react-router-dom';
import "@radix-ui/themes/styles.css";

//components
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import ClientDashboard from './Pages/ClientDashboard';
import ProviderDashboard from './Pages/ProviderDashboard';
import AdminDashboard from './Pages/AdminDashboard';

function App() {
  const {check,authUser,isChecking}=useAuthStore();
    useEffect(()=>{
      check();
    },[check]);

    //loading animation
    if(isChecking){
      return <div className='flex justify-center items-center h-screen'>
        <span className="loading loading-ring loading-xl"></span>
      </div>
    }

  //intialize aos for the fade animation
    AOS.init({
      duration:1000
    });

  return (
    <>
      <Routes>
        <Route path="/" element={authUser?.role === 'client'||
                                authUser?.role === 'provider'||
                                authUser?.role === 'admin'?
                                <Navigate to="/dashboard"/>:<LandingPage/>}/>

        <Route path="/login" element={authUser?<Navigate to="/dashboard"/>:<LoginPage/>}/>
        <Route path="/register" element={authUser?<Navigate to="/dashboard"/>:<RegisterPage/>}/>
        
        <Route path='/dashboard' element={authUser?.role === 'client'?<ClientDashboard/>
                                          :authUser?.role === 'provider'?<ProviderDashboard/>
                                          :authUser?.role === 'admin'?<AdminDashboard/>
                                          :<Navigate to="/"/>}/>
      </Routes>
    </>
  )
}

export default App
