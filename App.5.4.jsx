import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Simulate fetching blogs (replace with actual API call)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs'); // Replace with actual API endpoint
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error(error);
        setErrorMessage('Error fetching blogs');
        setNotificationMessage('Virhe haettaessa blogeja!');
        setShowNotification(true);
      }
    };

    fetchBlogs();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    // Replace with actual login logic using form data
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }

      const data = await response.json();
      setUser(data.user); // Store user data (including token) in state
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user data in local storage
      setErrorMessage(null);
      setNotificationMessage('Kirjauduttu sisään onnistuneesti!');
      setShowNotification(true);
      toast('Kirjauduttu sisään onnistuneesti!', { type: 'success' });
    } catch (error) {
      console.error(error);
      setErrorMessage('Login failed. Please check your credentials.');
      setNotificationMessage('Kirjautuminen epäonnistui!');
      setShowNotification(true);
      toast('Kirjautuminen epäonnistui!', { type: 'error' });
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Redirect to login page or other relevant route (optional)
    setNotificationMessage('Uloskirjauduttu onnistuneesti!');
    setShowNotification(true);
    toast('Uloskirjauduttu onnistuneesti!', { type: 'success' });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Clear user state on component mount to prevent reload memory
    setUser(null);
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000} // Hide after 3 seconds
        hideProgressBar={true}
        pauseOnHover={false}
      />
      {user === null ? (
        <div className="login-form">
          <h2>Kirjaudu sisään</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleLogin}>
            <label htmlFor="username">Käyttäjätunnus:</label>
            <input type="text" id="username" name="username" required />
            <label htmlFor="password">Salasana:</label>
            <input type="password" id="password" name="password" required />
            <button type="submit">Kirjaudu sisään</button>
          </form>
        </div>
      ) : (
        <div className="logged-in-view">
          <h2>Hei, {user.name}!</h2>
          {blogs.length > 0 ? (
            <ul>
              {blogs.map((blog) => (
                <li key={blog.id}>... (code continues from previous section)
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Ei blogeja!</p>
        )}
        <button onClick={handleLogout}>Kirjaudu ulos</button>
      </div>
    )}
    {showNotification && (
      <div className="notification">
        <p>{notificationMessage}</p>
      </div>
    )}
  </div>
);
};

export default App;
