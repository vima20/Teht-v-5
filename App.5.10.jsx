import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles
import Togglable from './Togglable'; // Import Togglable component (replace with your implementation)
import CreateBlogForm from './CreateBlogForm'; // Import CreateBlogForm component
import Blog from './Blog'; // Import Blog component with updated logic (see Blog.js)

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
        toast('Virhe haettaessa blogeja!', { type: 'error' });
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
      localStorage.setItem('user', JSON.stringify(data.user));
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

  // Clear user state on component mount to prevent reload memory
  useEffect(() => {
    setUser(null);
  }, []); // Empty dependency array to run only once on mount

  const handleCreateBlog = async (title, content) => {
    if (!user) {
      setNotificationMessage('Kirjaudu sisään luodaksesi blogin!');
      setShowNotification(true);
      toast('Kirjaudu sisään luodaksesi blogin!', { type: 'info' });
      return;
    }

    const newBlog = {
      title,
      content,
      // Include user's ID or other relevant data
    };

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Include user's token
        },
        body: JSON.stringify(newBlog),
      });

      
      if (!response.ok) {
        throw new Error(`Blog creation failed with status ${response.status}`);
      }
      
      const createdBlog = await response.json();
      setBlogs([...blogs, createdBlog]); // Add new blog to blogs state
      setShowCreateBlogForm(false); // Close the form
      setNotificationMessage('Blogi luotu onnistuneesti!');
      setShowNotification(true);
      toast('Blogi luotu onnistuneesti!', { type: 'success' });
          } catch (error) {
            console.error(error);
            setErrorMessage('Virhe luotaessa blogia!');
            setNotificationMessage('Blogin luominen epäonnistui!');
            setShowNotification(true);
            toast('Blogin luominen epäonnistui!', { type: 'error' });
          }
        };
      
        const sortBlogsByLikes = () => {
          const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
          setBlogsSortedByLikes(sortedBlogs); // Optional: store sorted blogs in separate state
        };
      
        const [blogsSortedByLikes, setBlogsSortedByLikes] = useState([]); // Optional state for sorted blogs
      
        useEffect(() => {
          sortBlogsByLikes(); // Sort blogs initially
        }, [blogs]); // Re-sort when blogs array changes
      
        const handleNotificationClose = () => {
          setShowNotification(false);
        };
      
        return (
          <div className="App">
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            {notificationMessage && (
              <div className="notification-message">
                {notificationMessage}
                <button onClick={handleNotificationClose}>Sulje</button>
              </div>
            )}
      
            {user === null ? (
              <Togglable buttonLabel="Kirjaudu sisään">
                <LoginForm onLogin={handleLogin} />
              </Togglable>
            ) : (
              <div className="logged-in-view">
                <button onClick={handleLogout}>Kirjaudu ulos</button>
                <Togglable buttonLabel="Luo uusi blogi">
                  <CreateBlogForm onCreateBlog={handleCreateBlog} />
                </Togglable>
      
                <h2>Blogit (järjestetty tykkäysten mukaan)</h2>
                <ul>
                  {blogsSortedByLikes.length > 0 ? ( // Render sorted blogs if available
                    blogsSortedByLikes.map((blog) => (
                      <Blog key={blog._id} blog={blog} user={user} />
                    ))
                  ) : (
                    <p>Ei blogeja vielä.</p>
                  )}
                </ul>
              </div>
            )}
      
            <ToastContainer />
          </div>
        );
      };
      
      export default App;
      