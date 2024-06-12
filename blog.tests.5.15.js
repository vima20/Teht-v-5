import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog'; // Replace with your component path

describe('Blog Display Component', () => {
  const mockBlogData = {
    _id: '123',
    title: 'My Awesome Blog Post',
    author: 'John Doe',
    content: 'This is the blog post content.',
    url: 'https://example.com/blog/123',
    likes: 10,
    user: {
      username: 'johndoe',
      email: 'johndoe@example.com',
    },
  };

  it('should render blog title and author by default', () => {
    render(<Blog blog={mockBlogData} />);

    const titleElement = screen.getByText('My Awesome Blog Post');
    const authorElement = screen.getByText('John Doe');

    expect(titleElement).toBeInTheDocument();
    expect(authorElement).toBeInTheDocument();
  });

  it('should not render URL, likes count, or user by default', () => {
    render(<Blog blog={mockBlogData} />);

    const urlElement = screen.queryByText('https://example.com/blog/123');
    const likesCountElement = screen.queryByText('10');
    const usernameElement = screen.queryByText('johndoe');

    expect(urlElement).not.toBeInTheDocument();
    expect(likesCountElement).not.toBeInTheDocument();
    expect(usernameElement).not.toBeInTheDocument();
  });

  it('should render URL, likes count, and user when "Show All Information" button is clicked', () => {
    render(<Blog blog={mockBlogData} />);

    const showAllButton = screen.getByRole('button', { name: 'Näytä kaikki tiedot' });
    userEvent.click(showAllButton);

    const urlElement = screen.getByText('https://example.com/blog/123');
    const likesCountElement = screen.getByText('10');
    const usernameElement = screen.getByText('johndoe');

    expect(urlElement).toBeInTheDocument();
    expect(likesCountElement).toBeInTheDocument();
    expect(usernameElement).toBeInTheDocument();
  });

  it('should call the like handler prop function twice when the like button is clicked twice', () => {
    const mockLikeHandler = jest.fn();

    render(<Blog blog={mockBlogData} onLike={mockLikeHandler} />);

    const likeButton = screen.getByRole('button', { name: 'Tykkää' });

    userEvent.click(likeButton);
    userEvent.click(likeButton);

    expect(mockLikeHandler).toHaveBeenCalledTimes(2);
  });
});
