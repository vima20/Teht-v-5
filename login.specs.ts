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

    // Navigate to the application
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    // Check if login form elements are present
    const usernameInput = await page.locator('#username');
    const passwordInput = await page.locator('#password');
    const loginButton = await page.locator('button[type="submit"]');

    expect(usernameInput).toBeVisible();
    expect(passwordInput).toBeVisible();
    expect(loginButton).toBeVisible();

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

    // Navigate to the application
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    // Check if login form elements are present
    const usernameInput = await page.locator('#username');
    const passwordInput = await page.locator('#password');
    const loginButton = await page.locator('button[type="submit"]');

    expect(usernameInput).toBeVisible();
    expect(passwordInput).toBeVisible();
    expect(loginButton).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // Fill in correct credentials
      const usernameInput = await page.locator('#username');
      const passwordInput = await page.locator('#password');
      const loginButton = await page.locator('button[type="submit"]');

      await usernameInput.fill('mluukkai');
      await passwordInput.fill('salainen');
      await loginButton.click();

      // Expect to be redirected to the main app page
      await expect(page).toHaveURL('http://localhost:5173/notes');
    });

    test('fails with wrong credentials', async ({ page }) => {
      // Fill in incorrect credentials
      const usernameInput = await page.locator('#username');
      const passwordInput = await page.locator('#password');
      const loginButton = await page.locator('button[type="submit"]');

      await usernameInput.fill('mluukkai');
      await passwordInput.fill('wrongpassword');
      await loginButton.click();

      // Expect error message to be displayed
      const errorMessage = await page.locator('.error-message');
      expect(errorMessage).toBeVisible();
      expect(errorMessage).toHaveTextContent('Virheellinen käyttäjätunnus tai salasana');
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
            // Navigate to the blog creation page
            await page.goto('http://localhost:5173/blogs/new');
      
            // Fill in blog details
            const titleInput = await page.locator('#title');
            const contentInput = await page.locator('#content');
            const createButton = await page.locator('button[type="submit"]');
      
            await titleInput.fill('My New Blog Post');
            await contentInput.fill('This is the blog post content.');
            await createButton.click();
      
            // Expect to be redirected to the blog list page
            await expect(page).toHaveURL('http://localhost:5173/blogs');
      
            // Check if the new blog is listed
            const newBlogTitle = await page.locator('.blog-list-item h2');
            expect(newBlogTitle).toBeVisible();
            expect(newBlogTitle).toHaveTextContent('My New Blog Post');
          });
        });
      });
    });
  });
});
});
});
