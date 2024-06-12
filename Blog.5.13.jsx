import React from 'react';
import { render, screen } from '@testing-library/react';
import Blog from './Blog'; // Replace with your component path

describe('Blog Display Component', () => {
  const mockBlogData = {
    _id: '123',
    title: 'My Awesome Blog Post',
    author: 'John Doe',
    content: 'This is the blog post content.',
    url: 'https://example.com/blog/123',
    likes: 10,
  };

  it('should render blog title and author', () => {
    render(<Blog blog={mockBlogData} />);

    const titleElement = screen.getByText('My Awesome Blog Post');
    const authorElement = screen.getByText('John Doe');

    expect(titleElement).toBeInTheDocument();
    expect(authorElement).toBeInTheDocument();
  });

  it('should render URL if prop is provided', () => {
    render(<Blog blog={mockBlogData} showUrl />);

    const urlElement = screen.getByText('https://example.com/blog/123');

    expect(urlElement).toBeInTheDocument();
  });

  it('should not render URL by default', () => {
    render(<Blog blog={mockBlogData} />);

    const urlElement = screen.queryByText('https://example.com/blog/123');

    expect(urlElement).not.toBeInTheDocument();
  });

  it('should render likes count if prop is provided', () => {
    render(<Blog blog={mockBlogData} showLikesCount />);

    const likesCountElement = screen.getByText('10');

    expect(likesCountElement).toBeInTheDocument();
  });

  it('should not render likes count by default', () => {
    render(<Blog blog={mockBlogData} />);

    const likesCountElement = screen.queryByText('10');

    expect(likesCountElement).not.toBeInTheDocument();
  });
});
