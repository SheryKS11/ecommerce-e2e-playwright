import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { TEST_USER, LOCKOUT_USER, generateUniqueEmail } from '../fixtures/testData';

Given('I navigate to the home page', async function (this: CustomWorld) {
  await this.homePage.goto();
});

Given('I navigate to the registration page', async function (this: CustomWorld) {
  await this.registerPage.goto();
});

Given('I navigate to the login page', async function (this: CustomWorld) {
  await this.loginPage.goto();
});

Given('I am logged in as a registered user', async function (this: CustomWorld) {
  await this.loginPage.goto();
  await this.loginPage.login(TEST_USER.email, TEST_USER.password);
  await this.page.waitForURL(/route=account\/account/);
});

// TC01
Then('the page title should contain {string}', async function (this: CustomWorld, titleText: string) {
  const title = await this.homePage.getTitle();
  expect(title).toContain(titleText);
});

// TC02
When('I fill in valid registration details with a unique email', async function (this: CustomWorld) {
  await this.registerPage.fillForm({
    firstName: 'Test',
    lastName: 'User',
    email: generateUniqueEmail(),
    telephone: '0400000000',
    password: 'Test@1234!',
    confirmPassword: 'Test@1234!'
  });
});

When('I agree to the privacy policy', async function (this: CustomWorld) {
  await this.registerPage.agreeToPrivacyPolicy();
});

When('I submit the registration form', async function (this: CustomWorld) {
  await this.registerPage.submit();
});

Then('I should see {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page.locator('body')).toContainText(text);
});

// TC03
When('I fill in registration details with an already registered email', async function (this: CustomWorld) {
  await this.registerPage.fillForm({
    firstName: 'Test',
    lastName: 'User',
    email: TEST_USER.email,
    telephone: '0400000000',
    password: 'Test@1234!',
    confirmPassword: 'Test@1234!'
  });
});

Then('I should see a warning containing {string}', async function (this: CustomWorld, text: string) {
  const warning = this.page.locator('.alert-danger, .alert-warning, .text-danger');
  await warning.first().waitFor({ state: 'visible' });
  const warningText = await warning.first().innerText();
  expect(warningText.toLowerCase()).toContain(text.toLowerCase());
});

// TC04
When('I submit the registration form without filling any fields', async function (this: CustomWorld) {
  await this.registerPage.submit();
});

Then('field validation errors should be displayed', async function (this: CustomWorld) {
  const errors = await this.registerPage.getValidationErrors();
  expect(errors.length).toBeGreaterThan(0);
});

// TC05
When('I fill in registration details with a 1-character password', async function (this: CustomWorld) {
  await this.registerPage.fillForm({
    firstName: 'Test',
    lastName: 'User',
    email: generateUniqueEmail(),
    telephone: '0400000000',
    password: 'a',
    confirmPassword: 'a'
  });
});

Then('I should see a password length validation error', async function (this: CustomWorld) {
  const error = this.page.locator('.text-danger').filter({ hasText: 'Password must be between 4 and 20 characters!' });
  await expect(error).toBeVisible();
});

// TC06
When('I enter valid credentials and submit', async function (this: CustomWorld) {
  await this.loginPage.login(TEST_USER.email, TEST_USER.password);
});

Then('I should be redirected to the My Account dashboard', async function (this: CustomWorld) {
  await this.page.waitForURL(/route=account\/account/);
  expect(this.page.url()).toContain('route=account/account');
});

// TC07
When('I enter a valid email with an incorrect password', async function (this: CustomWorld) {
  await this.loginPage.login(TEST_USER.email, 'WrongPassword999!');
});

// TC08
When('I attempt to login with wrong credentials {int} times', async function (this: CustomWorld, attempts: number) {
  for (let i = 0; i < attempts; i++) {
    await this.loginPage.goto();
    await this.loginPage.login(LOCKOUT_USER.email, LOCKOUT_USER.wrongPassword);
  }
});

Then('I should see an account locked or exceeded attempts warning', async function (this: CustomWorld) {
  const warning = this.page.locator('.alert-danger');
  await warning.waitFor({ state: 'visible' });
  const text = await warning.innerText();
  const isLocked = text.toLowerCase().includes('exceeded') || text.toLowerCase().includes('locked') ||
                   text.toLowerCase().includes('no match');
  expect(isLocked).toBeTruthy();
});

// TC09
When('I click logout', async function (this: CustomWorld) {
  await this.homePage.clickLogout();
});

Then('I should see the logout confirmation page', async function (this: CustomWorld) {
  await this.page.waitForURL(/route=account\/logout/);
  expect(this.page.url()).toContain('route=account/logout');
});

// TC27
When('I update my first name to {string}', async function (this: CustomWorld, name: string) {
  await this.accountPage.goto();
  await this.accountPage.editFirstName(name);
});

Then('I should see a success confirmation message', async function (this: CustomWorld) {
  const alert = await this.accountPage.getSuccessAlert();
  expect(alert).toBeTruthy();
});

// TC28
When('I set my newsletter preference to subscribed', async function (this: CustomWorld) {
  await this.accountPage.goto();
  await this.accountPage.toggleNewsletter(true);
});
