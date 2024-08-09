 
const logout = () => {
  // Clear authentication tokens or session data
  localStorage.removeItem('authToken'); // Example for localStorage

  // Redirect to the login page or home page
  window.location.href = '/login'; // Use window.location.href for redirection
};

export default logout;