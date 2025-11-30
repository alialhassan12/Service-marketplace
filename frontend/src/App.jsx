import AOS from 'aos';
import {Routes,Route,Navigate} from 'react-router-dom';
//components
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';

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
      </Routes>
    </>
  )
}

export default App
