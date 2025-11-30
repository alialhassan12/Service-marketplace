import AOS from 'aos';
import {Routes,Route,Navigate} from 'react-router-dom';
import "@radix-ui/themes/styles.css";

//components
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
function App() {
  
  //intialize aos for the fade animation
    AOS.init({
      duration:1000
    });

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
      </Routes>
    </>
  )
}

export default App
