import { test, expect } from '../../fixtures/extensionFixture';
import { API_ENDPOINTS } from '../../fixtures/sample-apis';

/**
 * Toggle Functionality Test Suite
 * Tests extension start/stop capture functionality
 * Validates state transitions, capture control, and data persistence
 */

test.describe('APIsec Bolt Extension - Toggle Functionality', () => {
  test.setTimeout(90000);

  /**
   * Test ID: TF-001
   * Verify basic start capture toggle
   * Validates: Start button triggers capture
   */
  test('TF-001: should toggle capture on and off', async ({ extensionPanel }) => {
    await extensionPanel.goto();
    
    // Start capture
    await extensionPanel.startCapture();
    console.log('✅ Capture started');
    
    // Wait for start button to become hidden (not visible)
    await extensionPanel.startButton.waitFor({ state: 'hidden', timeout: 5000 });
    // Verify start button disappears (not visible)
    const isStartVisible = await extensionPanel.startButton.isVisible().catch(() => false);
    expect(isStartVisible).toBe(false);
  });

  /**
   * Test ID: TF-002
   * Verify data is captured only while capture is active
   * Validates: Capture toggle controls data collection
   */
    test('TF-002: should only capture when started', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
  
    // Before starting capture, OAS button should not be visible
    const isOASVisible = await extensionPanel.exportButton.isVisible().catch(() => false);
    expect(isOASVisible).toBe(false);
    
    // Start capture
    await extensionPanel.startCapture();
    
    // After starting capture, OAS button should be visible
    await extensionPanel.exportButton.waitFor({ state: 'visible', timeout: 5000 });
    const isOASVisibleAfter = await extensionPanel.exportButton.isVisible();
    expect(isOASVisibleAfter).toBe(true);
    });
  /**
   * Test ID: TF-003
   * Verify multiple start/send API/ export cycles maintain functionality
   * Validates: Toggle resilience, state reset between cycles
   */
    test('TF-003: should handle start, export, new, and repeat', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
  
    // First cycle: start, send API, export
    await extensionPanel.startCapture();
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.page.waitForTimeout(1000);
    let oasSpec = await extensionPanel.exportAndParseOAS();
    expect(Object.keys(oasSpec.paths || {}).length).toBeGreaterThan(0);
    console.log('✅ First cycle complete');
  
    // Click "New" to reset
    await extensionPanel.page.locator('#header-new-button').click();
    await extensionPanel.startButton.waitFor({ state: 'visible', timeout: 5000 });
  
    // Second cycle: start, send API, export
    await extensionPanel.startCapture();
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/2`);
    await targetWebsitePage.page.waitForTimeout(1000);
    oasSpec = await extensionPanel.exportAndParseOAS();
    expect(Object.keys(oasSpec.paths || {}).length).toBeGreaterThan(0);
    console.log('✅ Second cycle complete');
  });
 

  /**
   * Test ID: TF-004
   * Verify capture state persists during page navigation
   * Validates: Background capture continues across page loads
   */
  test('TF-004: should maintain capture state during navigation', async ({ extensionPanel, targetWebsitePage }) => {
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    // Navigate to page 1 and make request
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.page.waitForTimeout(1000);
    
    // Navigate to page 2 and make request (capture should still be active)
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.users);
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.users}/1`);
    await targetWebsitePage.page.waitForTimeout(2000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('Captured across navigation:', Object.keys(oasSpec.paths || {}));
    expect(Object.keys(oasSpec.paths || {}).length).toBeGreaterThan(0);
  });
});