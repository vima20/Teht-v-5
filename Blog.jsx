import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles
import Togglable from './Togglable'; // Import Togglable component (replace with your implementation)
import CreateBlogForm from './CreateBlogForm'; // Import CreateBlogForm component

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

  useEffect(() => {
    // Clear user state on component mount to prevent reload memory
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

      const createdBlog = await response.json()
      setBlogs([...blogs, createdBlog]); // Add new blog to blogs state
      setShowCreateBlogForm(false); // Close the form
      setNotificationMessage('Blogi luotu onnistuneesti!');
      setShowNotification(true);
      toast('Blogi luotu onnistuneesti!', { type: 'success' });
    } catch (error) {
      console.error(error);
      setErrorMessage('Virhe luotaessa blogia!');
      setShowNotification(true);
      toast('Virhe luotaessa blogia!', { type: 'error' });
    }
  };

  const [showCreateBlogForm, setShowCreateBlogForm] = useState(false);

  return (
    <div className="App">
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
      {showNotification && (
        <div className="notification-message">{notificationMessage}</div>
      )}
      {user === null ? (
        <div className="login-form">
          <h2>Kirjaudu sisään</h2>
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
          <h2>Blogit</h2>
          <ul>
            {blogs.map((blog) => (
              <Blog key={blog._id} blog={blog} />
            ))}
          </ul>
          <button onClick={() => setShowCreateBlogForm(true)}>Luo uusi blogi</button>

          {showCreateBlogForm && (
            <Togglable show={showCreateBlogForm} close={() => setShowCreateBlogForm(false)}>
              <CreateBlogForm
                handleCreateBlog={handleCreateBlog}
                closeForm={() => setShowCreateBlogForm(false)}
              />
            </Togglable>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

// Blog component with expanded/collapsed state
const Blog = ({ blog }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleExpand}>
          {isExpanded ? 'Sulje tiedot' : 'Näytä tiedot'}
        </button>
      </div>
      {isExpanded && (
        <div className="blog-details">
          <p>{blog.content}</p>
          {/* You can add other details like comments, likes, etc. */}
        </div>
      )}
    </div>
  );
};

export default Blog;
