import React, { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import isAuthenticated from '../../utils/auth';

const Welcome = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (authenticated) {
      navigate('/Dashboard'); // Redirect to dashboard if authenticated
    }
  }, [authenticated, navigate]);

  if (!authenticated) {
    return (
      <div class="text-center">
        <h2>Selamat Datang  </h2>
        <h5>Technical Test - Fullstack Developer</h5>
        <h5>Dibuat : Ardella Eka K</h5>
      </div>
    );
  }

  // Return null or a loading indicator while redirecting
  return null;
};

export default Welcome;
