import { test, expect } from '@playwright/test'

const TEST_EMAIL = `e2e-notes-${Date.now()}@test.com`
const TEST_PASSWORD = 'testpass1'

test.describe('Notes', () => {
  test.beforeEach(async ({ page }) => {
    // Sign up a fresh user and land on dashboard
    await page.goto('/signup')
    await page.getByPlaceholder('Email address').fill(TEST_EMAIL)
    await page.getByPlaceholder('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Sign Up' }).click()
    await page.waitForURL('/dashboard')
  })

  test('shows empty state when no notes exist', async ({ page }) => {
    await expect(page.getByText("I'm just here waiting for your charming notes...")).toBeVisible()
  })

  test('shows default categories in sidebar', async ({ page }) => {
    await expect(page.getByText('Random Thoughts')).toBeVisible()
    await expect(page.getByText('School')).toBeVisible()
    await expect(page.getByText('Personal')).toBeVisible()
  })

  test('shows + New Note button', async ({ page }) => {
    await expect(page.getByRole('button', { name: '+ New Note' })).toBeVisible()
  })

  test('can create a new note and navigate to editor', async ({ page }) => {
    await page.getByRole('button', { name: '+ New Note' }).click()

    // Should navigate to note editor
    await page.waitForURL(/\/dashboard\/note\/\d+/)
    await expect(page.getByPlaceholder('Note Title')).toBeVisible()
    await expect(page.getByPlaceholder('Pour your heart out...')).toBeVisible()
  })

  test('can edit note title and content', async ({ page }) => {
    await page.getByRole('button', { name: '+ New Note' }).click()
    await page.waitForURL(/\/dashboard\/note\/\d+/)

    await page.getByPlaceholder('Note Title').fill('My First Note')
    await page.getByPlaceholder('Pour your heart out...').fill('Hello world!')

    // Wait for auto-save debounce
    await page.waitForTimeout(1000)

    // Close and go back to dashboard
    await page.locator('button:has(svg)').last().click()
    await page.waitForURL('/dashboard')
  })
})
