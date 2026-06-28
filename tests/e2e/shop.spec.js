import { test, expect } from '@playwright/test';

test.describe('KayaVox Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('page loads with correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/KayaVox/);
    });

    test('hero section is visible', async ({ page }) => {
        const hero = page.locator('#hero-text-block');
        await expect(hero).toBeVisible();
    });

    test('hero image loads', async ({ page }) => {
        const img = page.locator('#heroImage');
        await expect(img).toBeVisible();
        await expect(img).toHaveAttribute('src', /impasto-01\.webp/);
    });

    test('navigation links are present', async ({ page }) => {
        await expect(page.locator('a[href="#shop"]')).toHaveCount(2);
        await expect(page.locator('a[href="#our-world"]')).toHaveCount(2);
    });

    test('language selector works', async ({ page }) => {
        const selector = page.locator('#lang-selector');
        await selector.selectOption('ru');
        await page.waitForTimeout(300);

        const heroTitle = page.locator('[data-i18n="hero_title"]');
        await expect(heroTitle).toContainText('Тихая роскошь');

        await selector.selectOption('en');
        await page.waitForTimeout(300);
        await expect(heroTitle).toContainText('stillness');
    });
});

test.describe('Cart Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        page.on('console', msg => {
            if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
        });
    });

    test('add to cart opens cart drawer', async ({ page }) => {
        const addBtn = page.locator('[data-action="add-to-cart"]').first();
        await addBtn.click();

        const cart = page.locator('#cart-drawer');
        await expect(cart).not.toHaveClass(/translate-x-full/);
    });

    test('cart counter updates after adding item', async ({ page }) => {
        const addBtn = page.locator('[data-action="add-to-cart"]').first();
        await addBtn.click();

        const counter = page.locator('#cart-counter');
        await expect(counter).toContainText('1');
    });

    test('remove item from cart', async ({ page }) => {
        const addBtn = page.locator('[data-action="add-to-cart"]').first();
        await addBtn.click();
        await page.waitForTimeout(300);

        const removeBtn = page.locator('[data-action="remove-item"]').first();
        await removeBtn.click();

        const counter = page.locator('#cart-counter');
        await expect(counter).toContainText('0');
    });
});

test.describe('Product Collections', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('collections container is populated', async ({ page }) => {
        const container = page.locator('#collections-container');
        await expect(container).not.toBeEmpty();
    });

    test('Impasto collection is first', async ({ page }) => {
        const firstCollection = page.locator('#collections-container > div').first();
        await expect(firstCollection).toContainText('Impasto');
    });

    test('carousel images are present', async ({ page }) => {
        const carousels = page.locator('.stories-carousel');
        const count = await carousels.count();
        expect(count).toBeGreaterThanOrEqual(3);
    });

    test('bundle section is visible', async ({ page }) => {
        await page.locator('#shop').scrollIntoViewIfNeeded();
        const bundle = page.locator('[data-action="add-to-cart"][data-id="prod-bundle"]');
        await expect(bundle).toBeVisible();
    });
});

test.describe('Cookie Consent', () => {
    test('cookie banner appears after delay', async ({ page }) => {
        await page.goto('/');
        const banner = page.locator('#cookie-banner');
        await expect(banner).toBeVisible({ timeout: 5000 });
    });

    test('accept button dismisses banner', async ({ page }) => {
        await page.goto('/');
        const banner = page.locator('#cookie-banner');
        await expect(banner).toBeVisible({ timeout: 5000 });

        await page.locator('#cookie-accept').click();
        await expect(banner).toHaveClass(/opacity-0/);
    });
});

test.describe('Blog Pages', () => {
    test('journal index loads', async ({ page }) => {
        await page.goto('/journal.html');
        await expect(page).toHaveTitle(/Journal/);
    });

    test('article pages load', async ({ page }) => {
        await page.goto('/journal/the-art-of-stillness.html');
        await expect(page).toHaveTitle(/Art of Stillness/);
    });

    test('filter buttons work on journal', async ({ page }) => {
        await page.goto('/journal.html');
        const cards = page.locator('.card');
        const initialCount = await cards.count();

        await page.locator('[data-f="technique"]').click();
        await page.waitForTimeout(200);

        const visibleCards = page.locator('.card:not([style*="display: none"])');
        const filteredCount = await visibleCards.count();
        expect(filteredCount).toBeLessThan(initialCount);
    });
});
