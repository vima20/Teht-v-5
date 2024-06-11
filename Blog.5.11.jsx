import React, { useState } from 'react';

const Blog = ({ blog, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const handleLikeClick = async () => {
    setErrorMessage(null); // Clear any previous error messages

    const updatedBlog = {
      ...blog, // Spread the existing blog data
      likes: blog.likes + 1, // Increment likes count
    };

    try {
      const response = await fetch(`/api/blogs/${blog._id}`, {
        method: 'PUT', // Use PUT method to update
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Include authorization token (if needed)
        },
        body: JSON.stringify(updatedBlog),
      });

      if (!response.ok) {
        throw new Error(`Failed to update blog: ${response.status}`);
      }

      // Update likes state and UI
      const updatedData = await response.json();
      setLikes(updatedData.likes);
    } catch (error) {
      console.error(error);
      setErrorMessage('Virhe päivitettäessä blogia!'); // Set error message
    }
  };

  const handleDeleteBlog = async () => {
    if (!window.confirm(`Haluatko varmasti poistaa blogin "${blog.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${blog._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Include user's token
        },
      });

      if (!response.ok) {
        throw new Error(`Blog deletion failed with status ${response.status}`);
      }

      setBlogs(blogs.filter((b) => b._id !== blog._id)); // Remove blog from blogs state
      setNotificationMessage('Blogi poistettu onnistuneesti!');
      setShowNotification(true);
      toast('Blogi poistettu onnistuneesti!', { type: 'success' });
    } catch (error) {
      console.error(error);
      setErrorMessage('Virhe poistettaessa blogia!');
      setNotificationMessage('Blogin poistaminen epäonnistui!');
      setShowNotification(true);
      toast('Blogin poistaminen epäonnistui!', { type: 'error' });
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleExpand}>
          {isExpanded ? 'Sulje tiedot' : 'Näytä tiedot'}
        </button>
        {user && blog.author === user.username && ( // Show delete only for logged-in user and their blog
          <button onClick={handleDeleteBlog}>Poista</button>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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
