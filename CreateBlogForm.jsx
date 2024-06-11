import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

// ... (imports for other components like Togglable)

const App = () => {
  // ... (state and other functions like setUser, setBlogs, handleLogin, handleLogout, etc.)

  // Function to handle blog creation
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
      setShowNotification(true);
      toast('Virhe luotaessa blogia!', { type: 'error' });
    }
  };

  // ... (other functions)

  return (
    <div className="App">
      {user === null ? (
        // ... (Login form)
      ) : (
        <div className="logged-in-view">
          // ... (Blog list)

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

// CreateBlogForm component (separate file)
const CreateBlogForm = ({ handleCreateBlog, closeForm }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check form inputs and create new blog
    // ... (Implement form validation and data handling)

    // Call handleCreateBlog function
    handleCreateBlog(title, content);
  };

  return (
    <div className="create-blog-form">
      <h2>Luo uusi blogi</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Otsikko:</label>
        <input type="text" id="title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <label htmlFor="content">Sisältö:</label>
        <textarea id="content" name="content" value={content} onChange={(event) => setContent(event.target.value)} required />
        <button type="submit">Luo</button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
