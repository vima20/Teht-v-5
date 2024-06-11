import React, { useState, useEffect } from 'react';

const Blog = ({ blog, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(blog.likes); // Add state to manage likes
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
      likes: likes + 1, // Increment likes count
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

  useEffect(() => {
    // Update UI with potential changes in likes from other users
    setLikes(blog.likes);
  }, [blog.likes]); // Dependency array to run when blog.likes changes

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleExpand}>
          {isExpanded ? 'Sulje tiedot' : 'Näytä tiedot'}
        </button>
        {user && ( // Only show like button if user is logged in
          <button onClick={handleLikeClick}>Tykkää</button>
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
