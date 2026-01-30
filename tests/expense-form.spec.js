// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const localFilePath = `file://${path.resolve(__dirname, '../index.html')}`;

test.describe('Pharmacy Expenses Form', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(localFilePath);
    });

    test('should have correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/Лаки Фарма - Запись расходов/);
    });

    test('should show validation errors on empty submit', async ({ page }) => {
        const submitBtn = page.locator('button[type="submit"]');
        await submitBtn.click();

        // Check Pharmacy Number error
        const pharmacyError = page.locator('#error-pharmacy-number');
        await expect(pharmacyError).toBeVisible();
        await expect(pharmacyError).toHaveText('Введите номер аптеки');

        // Check Category error
        const categoryError = page.locator('#error-category');
        await expect(categoryError).toBeVisible();
        await expect(categoryError).toHaveText('Выберите категорию');

        // Check Amount error
        const amountError = page.locator('#error-amount');
        await expect(amountError).toBeVisible();
        await expect(amountError).toHaveText('Введите корректную сумму');
    });

    test('should enforce comment requirement for "Прочие расходы" (Other Expenses)', async ({ page }) => {
        // Select "Other Expenses"
        await page.selectOption('#category', 'Прочие расходы');

        // Try submit
        await page.locator('button[type="submit"]').click();

        // Comment error should be visible
        const commentError = page.locator('#error-comment');
        await expect(commentError).toBeVisible();
        await expect(commentError).toHaveText('Обязательно добавьте комментарий');
    });

    test('should change placeholder and require comment for "Зарплата" (Salary)', async ({ page }) => {
        // Select "Salary"
        await page.selectOption('#category', 'Зарплата, аванс, отпускные');

        // Check placeholder
        const commentInput = page.locator('#comment');
        await expect(commentInput).toHaveAttribute('placeholder', 'Укажите ФИО сотрудника');

        // Try submit without comment
        await page.locator('button[type="submit"]').click();

        // Error check
        const commentError = page.locator('#error-comment');
        await expect(commentError).toBeVisible();
        await expect(commentError).toHaveText('Укажите ФИО');
    });

    test('should submit successfully with valid data', async ({ page }) => {
        // Mock the Webhook response
        await page.route('**/webhook/**', async route => {
            const json = { status: 'success' };
            await route.fulfill({ json });
        });

        // Fill Form
        await page.fill('#pharmacy-number', '99');
        await page.selectOption('#category', 'Вода');
        await page.fill('#amount', '150');

        // Submit
        await page.locator('button[type="submit"]').click();

        // Check Success Modal
        const modal = page.locator('#success-modal');
        await expect(modal).toBeVisible();
        await expect(modal.locator('.modal-title')).toHaveText('Успешно!');
    });

    test('should show error modal on server error', async ({ page }) => {
        // Mock a 500 Server Error
        await page.route('**/webhook/**', async route => {
            await route.fulfill({ status: 500, body: 'Internal Server Error' });
        });

        // Fill Form
        await page.fill('#pharmacy-number', '99');
        await page.selectOption('#category', 'Вода');
        await page.fill('#amount', '150');

        // Submit
        await page.locator('button[type="submit"]').click();

        // Check Error Modal
        const modal = page.locator('#error-modal');
        await expect(modal).toBeVisible();
        await expect(modal.locator('.modal-title')).toHaveText('Ошибка');
        // Actual text might vary depending on app.js logic for fetch failure vs non-ok response
        // In app.js: if (!response.ok) alert('Ошибка при отправке данных...') -> replaced with showErrorModal
        await expect(modal.locator('#error-modal-text')).toHaveText('Ошибка при отправке данных. Попробуйте еще раз.');
    });
});
