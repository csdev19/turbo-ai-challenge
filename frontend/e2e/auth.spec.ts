import { test, expect } from '@playwright/test'

const TEST_EMAIL = `e2e-${Date.now()}@test.com`
const TEST_PASSWORD = 'testpass1'

test.describe('Signup', () => {
  test('can sign up and redirect to dashboard', async ({ page }) => {
    await page.goto('/signup')

    await expect(page.getByText('Yay, New Friend!')).toBeVisible()

    await page.getByPlaceholder('Email address').fill(TEST_EMAIL)
    await page.getByPlaceholder('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Sign Up' }).click()

    await page.waitForURL('/dashboard')
    await expect(page).toHaveURL('/dashboard')
  })

  test('shows link to login page', async ({ page }) => {
    await page.goto('/signup')

    const link = page.getByText("We're already friends!")
    await expect(link).toBeVisible()
    await link.click()

    await expect(page).toHaveURL('/login')
  })
})

test.describe('Login', () => {
  test.beforeAll(async ({ browser }) => {
    // Create an account first
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('/signup')
    await page.getByPlaceholder('Email address').fill(TEST_EMAIL)
    await page.getByPlaceholder('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Sign Up' }).click()
    await page.waitForURL('/dashboard')
    await context.close()
  })

  test('can log in and redirect to dashboard', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText("Yay, You're Back!")).toBeVisible()

    await page.getByPlaceholder('Email address').fill(TEST_EMAIL)
    await page.getByPlaceholder('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Login' }).click()

    await page.waitForURL('/dashboard')
    await expect(page).toHaveURL('/dashboard')
  })

  test('shows link to signup page', async ({ page }) => {
    await page.goto('/login')

    const link = page.getByText("Oops! I've never been here before")
    await expect(link).toBeVisible()
    await link.click()

    await expect(page).toHaveURL('/signup')
  })
})

test.describe('Route protection', () => {
  test('redirects /dashboard to /login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
