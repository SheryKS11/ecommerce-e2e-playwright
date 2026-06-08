import { chromium } from 'playwright';
import { TEST_USER } from '../fixtures/testData';

async function setup() {
  console.log(`Registering test user: ${TEST_USER.email}`);

  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/register');

  await page.locator('#input-firstname').fill(TEST_USER.firstName);
  await page.locator('#input-lastname').fill(TEST_USER.lastName);
  await page.locator('#input-email').fill(TEST_USER.email);
  await page.locator('#input-telephone').fill(TEST_USER.telephone);
  await page.locator('#input-password').fill(TEST_USER.password);
  await page.locator('#input-confirm').fill(TEST_USER.password);
  await page.locator('label[for="input-agree"]').click();
  await page.locator('input[type="submit"]').click();

  await page.waitForURL(/account/, { timeout: 10000 });

  const url = page.url();
  if (url.includes('account/success') || url.includes('account/account')) {
    console.log('✓ Account created successfully');
  } else {
    const warning = await page.locator('.alert-danger').innerText().catch(() => '');
    if (warning.toLowerCase().includes('already registered')) {
      console.log('✓ Account already exists — ready to run tests');
    } else {
      console.error('✗ Registration failed:', warning || url);
    }
  }

  await browser.close();
}

setup().catch(err => {
  console.error('✗ Setup failed:', err.message);
  process.exit(1);
});
