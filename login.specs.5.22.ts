import { test, expect, beforeEach, describe } from '@playwright/test';

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset database state
    await request.post('http://localhost:3003/api/testing/reset');

    // Create a test user (blog creator)
    const blogCreatorUser = {
      name: 'Matti Luukkainen',
      username: 'blogcreator',
      password: 'salainen',
    };
    await request.post('http://localhost:3003/api/users', {
      data: blogCreatorUser,
    });

    // Create a second test user (non-creator)
    const nonCreatorUser = {
      name: 'Maija Virtanen',
      username: 'maijav',
      password: 'salainen',
    };
    await request.post('http://localhost:3003/api/users', {
      data: nonCreatorUser,
    });

    // Log in as the blog creator
    await page.goto('http://localhost:5173');
    await page.locator('#username').fill(blogCreatorUser.username);
    await page.locator('#password').fill(blogCreatorUser.password);
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
      // ... (Existing blog deletion test code)
    });

    test('the delete button is only visible to the blog creator', async ({ page }) => {
      // Create a blog post
      await page.goto('http://localhost:5173/blogs/new');
      // ... (Fill in blog details and create)

      // Navigate to the blog list page
      await page.goto('http://localhost:5173/blogs');

      // Find the newly created blog
      const newBlogTitle = await page.locator('.blog-list-item h2');
      expect(newBlogTitle).toBeVisible();
      expect(newBlogTitle).toHaveTextContent('My New Blog Post');

      // Check if the delete button is visible for the blog creator
      const deleteButtonCreator = newBlogTitle.locator('button[aria-label="Delete this blog"]');
      expect(deleteButtonCreator).toBeVisible();

      // Log out as the blog creator
      await page.goto('http://localhost:5173/logout');

      // Log in as the non-creator user
      await page.goto('http://localhost:5173');
      await page.locator('#username').fill('maijav');
      await page.locator('#password').fill('salainen');
      await page.locator('button[type="submit"]').click();

      // Navigate to the blog list page again
      await page.goto('http://localhost:5173/blogs');

      // Find the newly created blog again
      const newBlogTitleNonCreator = await page.locator('.blog-list-item h2');
      expect(newBlogTitleNonCreator).toBeVisible();
      expect(newBlogTitleNonCreator).toHaveTextContent('My New Blog Post');

      // Check if the delete button is hidden for the non-creator
      const deleteButtonNonCreator = newBlogTitleNonCreator.locator('button[aria-label="Delete this blog"]');
      expect(deleteButtonNonCreator).toBeHidden();
    });
  });
});
