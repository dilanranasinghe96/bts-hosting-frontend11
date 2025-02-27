// AutoLogout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTO_LOGOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

const AutoLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    let timeoutId;
    
    // Function to reset the timer
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, AUTO_LOGOUT_TIME);
    };
    
    // Set up event listeners for user activity
    const setupActivityListeners = () => {
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(
        event => {
          document.addEventListener(event, resetTimer);
        }
      );
    };
    
    // Remove event listeners
    const cleanupActivityListeners = () => {
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(
        event => {
          document.removeEventListener(event, resetTimer);
        }
      );
      clearTimeout(timeoutId);
    };
    
    // Only set up the auto logout if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      resetTimer();
      setupActivityListeners();
    }
    
    // Clean up on component unmount
    return () => {
      cleanupActivityListeners();
    };
     // eslint-disable-next-line 
  }, [navigate]);
  
  return null; // This component doesn't render anything
};

export default AutoLogout;