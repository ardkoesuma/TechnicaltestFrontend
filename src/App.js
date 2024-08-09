
 
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import HeaderComponent from './views/layout/HeaderComponent';
import RegisterComponent from './views/first/Register';
import LoginComponent from './views/first/Login';
import WelcomeComponent  from './views/first/Welcome';
import DashboardComponent from './views/home/Dashboard';
import isAuthenticated from './utils/auth';
 
function App() {

    
    const authenticated = isAuthenticated();

  return (
    <div>
      <BrowserRouter>
        <HeaderComponent />
        <div className= "container">
          <Routes > 

            
              <Route path = "/" element = { <WelcomeComponent /> }></Route>
              <Route path = "/register" element = { <RegisterComponent /> }></Route>
              <Route path = "/login" element = { <LoginComponent /> }></Route> 
              <Route path = "/Dashboard" element = { <DashboardComponent /> }></Route>  
            </Routes>
        </div> 
        </BrowserRouter>
    </div>
  );
}

export default App;