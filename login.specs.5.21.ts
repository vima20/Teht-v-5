import { test, expect, beforeEach, describe } from '@playwright/test';

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset database state
    await request.post('http://localhost:3003/api/testing/reset');

    // Create a test user
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    });

    // Navigate to the application and log in
    await page.goto('http://localhost:5173');
    await page.locator('#username').fill('mluukkai');
    await page.locator('#password').fill('salainen');
    await page.locator('button[type="submit"]').click();
  });

  describe('When logged in', () => {
    test('a new blog can be created', async ({ page }) => {
      // ... (Existing blog creation test code)
    });

    test('a blog can be liked', async ({ page }) => {
      // ... (Existing blog liking test code)
    });

    test('a blog can be deleted by the creator', async ({ page }) => {
      // Create a blog post
      await page.goto('http://localhost:5173/blogs/new');
      // ... (Fill in blog details and create)

      // Navigate to the blog list page
      await page.goto('http://localhost:5173/blogs');

      // Find the newly created blog
      const newBlogTitle = await page.locator('.blog-list-item h2');
      expect(newBlogTitle).toBeVisible();
      expect(newBlogTitle).toHaveTextContent('My New Blog Post');

      // Locate the delete button for the blog
      const deleteButton = newBlogTitle.locator('button[aria-label="Delete this blog"]');
      await deleteButton.click();

      // Handle the confirmation dialog (if it exists)
      const dialog = page.on('dialog', (dialog) => {
        dialog.accept();
      });

      // Check if the blog is removed from the list
      await expect(newBlogTitle).toBeHidden();
    });
  });
});
