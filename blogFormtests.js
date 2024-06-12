import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm'; // Replace with your component path

describe('Blog Form Component', () => {
  const mockCreateBlog = jest.fn();

  it('should call the createBlog prop function with correct data when a new blog is created', () => {
    render(<BlogForm onCreateBlog={mockCreateBlog} />);

    const titleInput = screen.getByLabelText('Otsikko');
    const authorInput = screen.getByLabelText('Kirjoittaja');
    const contentInput = screen.getByLabelText('Sisältö');

    userEvent.type(titleInput, 'My New Blog Post');
    userEvent.type(authorInput, 'John Doe');
    userEvent.type(contentInput, 'This is the blog post content.');

    const submitButton = screen.getByRole('button', { name: 'Luo' });
    userEvent.click(submitButton);

    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'My New Blog Post',
      author: 'John Doe',
      content: 'This is the blog post content.',
    });
  });
});
