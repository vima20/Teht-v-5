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
  });
});
