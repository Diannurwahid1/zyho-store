import { test, expect } from '@playwright/test';

// Test data
const voucherCode = `TESTVOUCHER${Date.now()}`;
const bannerTitle = `Test Banner ${Date.now()}`;

test('Promo Banner should display linked voucher code', async ({ page }) => {
  // 1. Login as Admin to Payload CMS
  await page.goto('http://localhost:3000/admin');
  await page.fill('input[name="email"]', 'admin@example.com'); // Replace with admin email
  await page.fill('input[name="password"]', 'password'); // Replace with admin password
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:3000/admin');

  // 2. Create a Voucher
  await page.click('a:has-text("Vouchers")');
  await page.click('button:has-text("Create New")');
  await page.fill('input[name="codePrefix"]', 'TEST');
  await page.fill('input[name="discountValue"]', '20');
  await page.selectOption('select[name="discountType"]', 'percentage');
  await page.click('button:has-text("Save")');
  await expect(page).toHaveURL(/\/mlebu\/collections\/coupons\/\w+/);

  // 3. Create a Promo Banner and link it to the voucher
  await page.click('a:has-text("Promo Banners")');
  await page.click('button:has-text("Create New")');
  await page.fill('input[name="title"]', bannerTitle);
  await page.setInputFiles('input[type="file"]', {
    name: 'banner.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from(''),
  });
  await page.click('button:has-text("Select a Coupon")');
  await page.click(`text="${voucherCode}"`); // Select the voucher we just created
  await page.check('input[name="active"]');
  await page.click('button:has-text("Save")');
  await expect(page).toHaveURL(/\/mlebu\/collections\/promo-banners\/\w+/);

  // 4. Visit the Homepage and verify the promo banner displays the voucher code
  await page.goto('http://localhost:3000');
  const banner = page.locator(`text="${bannerTitle}"`).first();
  await expect(banner).toBeVisible();
  const voucherCodeElement = page.locator(`text="Gunakan kode: ${voucherCode}"`);
  await expect(voucherCodeElement).toBeVisible();
});
