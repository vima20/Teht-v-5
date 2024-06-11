import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
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
      toast('Kirjauduttu sisään onnistuneesti!', { type: 'success' });
    } catch (error) {
      console.error(error);
      setErrorMessage('Login failed. Please check your credentials.');
      toast('Kirjautuminen epäonnistui!', { type: 'error' });
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Redirect to login page or other relevant route (optional)
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

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    const title = newBlogTitle;
    const content = newBlogContent;

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Include user's token
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error(`Blog creation failed with status ${response.status}`);
      }

      const newBlog = await response.json();
      setBlogs([...blogs, newBlog]); // Update blogs state with new blog
      setNewBlogTitle(''); // Clear form fields after successful creation
      setNewBlogContent('');
      setNotificationMessage('Blogi lisätty onnistuneesti!');
      setShowNotification(true);
    } catch (error) {
      console.error(error);
      setNotificationMessage('Blogin luominen epäonnistui!');
      setShowNotification(true);
    }
  };

  const handleNewBlogTitleChange = (event) => {
    setNewBlogTitle(event.target.value);
  };

  const handleNewBlogContentChange = (event) => {
    setNewBlogContent(event.target.value);
  };
}
