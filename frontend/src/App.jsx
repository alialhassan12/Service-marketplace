import AOS from "aos";
import { Routes, Route, Navigate } from "react-router-dom";
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
import JobDetailsPage from './Pages/JobDetailsPage';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "./contexts/ThemeContext";
import ProviderUpdateProfile from './components/providerDashboardComponents/ProviderUpdateProfile';
import Snowfall from "react-snowfall";
import ViewProviderProfile from "./Pages/ViewProviderProfile";

function App() {
  const { check, authUser, isChecking } = useAuthStore();
  useEffect(() => {
    check();
  }, [check]);

  //loading animation
  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  //intialize aos for the fade animation
  AOS.init({
    duration: 1000,
  });

  // Normalize role to lowercase for comparison
  const userRole = authUser?.role?.toLowerCase();

  return (
      <ThemeProvider>
        <Snowfall color="#82C3D9"/>
        <Routes>
          <Route
            path="/"
            element={
              userRole === "client" ||
              userRole === "provider" ||
              userRole === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <LandingPage />
              )
            }
          />

          <Route
            path="/login"
            element={authUser ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={authUser ? <Navigate to="/dashboard" /> : <RegisterPage />}
          />

          <Route
            path="/dashboard/*"
            element={
              userRole === "client" ? (
                <ClientDashboard />
              ) : userRole === "provider" ? (
                <ProviderDashboard />
              ) : userRole === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />

        <Route path="/job/:id" element={authUser?<JobDetailsPage/>:<Navigate to="/login"/>}/>
        <Route path="/provider/update-profile" element={authUser?.role === 'provider'?<ProviderUpdateProfile/>:<Navigate to="/"/>}/>
        
        <Route path="/provider-profile/:id" element={authUser?<ViewProviderProfile/>:<Navigate to="/"/>}/>
      </Routes>
      
      <Toaster position="top-center" reverseOrder={false}/>
    
  </ThemeProvider>
  );
}

export default App;
