import { test, expect, beforeEach, describe } from '@playwright/test';

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset database state
    await request.post('http://localhost:3003/api/testing/reset');

    // Create a test user
    const user = {
      name: 'Matti Luukkainen',
      username: 'blogcreator',
      password: 'salainen',
    };
    await request.post('http://localhost:3003/api/users', {
      data: user,
    });

    // Log in as the test user
    await page.goto('http://localhost:5173');
    await page.locator('#username').fill(user.username);
    await page.locator('#password').fill(user.password);
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
      // ... (Existing delete button visibility test code)
    });

    test('blogs are sorted by likes in descending order', async ({ page }) => {
      // Create multiple blogs (at least 3)
      for (let i = 0; i < 3; i++) {
        await page.goto('http://localhost:5173/blogs/new');
        // ... (Fill in blog details and create)
      }

      // Navigate to the blog list page
      await page.goto('http://localhost:5173/blogs');

      // Get all blog titles and their corresponding like counts
      const blogTitlesAndLikeCounts = await page.evaluate(() => {
        const blogListItems = document.querySelectorAll('.blog-list-item');
        return Array.from(blogListItems).map((item) => {
          const title = item.querySelector('h2').textContent;
          const likeCountElement = item.querySelector('.like-count');
          const likeCount = parseInt(likeCountElement.textContent);
          return { title, likeCount };
        });
      });

      // Sort the blog titles and like counts based on like count (descending)
      blogTitlesAndLikeCounts.sort((a, b) => b.likeCount - a.likeCount);

      // Verify that the blog titles on the page match the sorted order
      for (let i = 0; i < blogTitlesAndLikeCounts.length; i++) {
        const expectedTitle = blogTitlesAndLikeCounts[i].title;
        const actualTitle = await page.locator('.blog-list-item h2').nth(i).textContent();
        expect(actualTitle).toBe(expectedTitle);
      }
    });
  });
});
