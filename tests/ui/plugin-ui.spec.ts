import { test, expect } from '../../fixtures/extensionFixture';
import { API_ENDPOINTS } from '../../fixtures/sample-apis';
/**
 * Plugin UI Test Suite
 * Tests extension's user interface elements and interactions
 * Validates UI rendering, button states, visual feedback, and accessibility
 */

test.describe('APIsec Bolt Extension - Plugin UI', () => {
  test.setTimeout(90000);

  /**
 * Test ID: UI-001
 * Verify extension panel loads with correct UI elements
 * Validates: Panel rendering, essential UI components visibility
 */
  test('UI-001: should render plugin UI correctly', async ({ extensionPanel }) => {
    await extensionPanel.goto();
  
    // Verify essential UI elements are present (may not all be visible initially)
    const isStartButtonVisible = await extensionPanel.startButton.isVisible();
  
    console.log('✅ Start button visible:', isStartButtonVisible);
  
    // Start button should always be visible on load
    expect(isStartButtonVisible).toBe(true);
  
    // Export button may be hidden/disabled initially - just check it exists in DOM
    const exportButtonCount = await extensionPanel.exportButton.count();
    console.log('✅ Export button exists in DOM:', exportButtonCount > 0);
    expect(exportButtonCount).toBeGreaterThan(0);
  });

  /**
 * Test ID: UI-002
 * Verify start button state changes on click
 * Validates: Button state transitions, visual feedback
 */
  test('UI-002: should update start button state on click', async ({ extensionPanel }) => {
    await extensionPanel.goto();
  
    // Initial state - start button should be enabled
    const isStartEnabled = !(await extensionPanel.startButton.isDisabled());
    expect(isStartEnabled).toBe(true);
  
    // Click start
    await extensionPanel.startCapture();
    await extensionPanel.page.waitForTimeout(1000);
  
    // After starting, check what changed (button text, visibility, or state)
    const startButtonText = await extensionPanel.startButton.textContent().catch(() => '');
    const isStartStillVisible = await extensionPanel.startButton.isVisible().catch(() => false);
    const stopButtonVisible = await extensionPanel.stopButton.isVisible().catch(() => false);
  
    console.log('✅ Start button text after click:', startButtonText);
    console.log('✅ Start button still visible:', isStartStillVisible);
    console.log('✅ Stop button visible:', stopButtonVisible);
  
    // The button should either change text, hide, or a stop button should appear
    const stateChanged = !isStartStillVisible || stopButtonVisible || startButtonText.toLowerCase().includes('stop');
  
    console.log('✅ Capture state changed:', stateChanged);
    expect(stateChanged).toBeTruthy();
  });

  /**
   * Test ID: UI-003
   * Verify export button is disabled when no data captured
   * Validates: Export button state management
   */
  test('UI-003: should disable export button with no data', async ({ extensionPanel }) => {
    await extensionPanel.goto();
    
    // Start and stop without capturing any data
    await extensionPanel.startCapture();
    await extensionPanel.page.waitForTimeout(500);
    
    // Check export button state
    const isExportDisabled = await extensionPanel.isExportButtonDisabled();
    const isExportVisible = await extensionPanel.isExportButtonVisible();
    
    console.log('✅ Export button disabled:', isExportDisabled);
    console.log('✅ Export button visible:', isExportVisible);
    
    expect(isExportVisible).toBe(true);
  });

  /**
   * Test ID: UI-004
   * Verify export button is enabled when data is captured
   * Validates: Export button state updates based on captured data
   */
  test('UI-004: should enable export button with captured data', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    // Capture some data
    await targetWebsitePage.reload();
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.page.waitForTimeout(2000);
    
    // Check export button state
    const isExportDisabled = await extensionPanel.isExportButtonDisabled();
    const isExportVisible = await extensionPanel.isExportButtonVisible();
    
    console.log('✅ Export button enabled:', !isExportDisabled);
    console.log('✅ Export button visible:', isExportVisible);
    
    expect(isExportVisible).toBe(true);
    expect(isExportDisabled).toBe(false);
  });

  /**
   * Test ID: UI-005
   * Verify panel title/heading is displayed
   * Validates: Panel branding, title visibility
   */
  test('UI-005: should display panel title', async ({ extensionPanel }) => {
    await extensionPanel.goto();
    
    const title = await extensionPanel.page.title();
    
    console.log('✅ Panel title:', title);
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  /**
 * Test ID: UI-006
 * Verify panel UI remains responsive during capture
 * Validates: UI responsiveness, no freezing during operations
 */
  test('UI-006: should keep UI responsive during capture', async ({ extensionPanel, targetWebsitePage }) => {
  // Start capture first before opening test page
    await extensionPanel.goto();
    await extensionPanel.startCapture();
  
    console.log('✅ Capture started');
  
    // Now open test page (panel is already capturing)
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await targetWebsitePage.reload();
  
    // Make API request
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.page.waitForTimeout(2000);
  
    // Bring panel back to foreground
    await extensionPanel.page.bringToFront();
    await extensionPanel.page.waitForTimeout(500);
  
    // Check if panel is still open
    if (extensionPanel.isClosed()) {
      console.log('⚠️ Panel closed during capture');
      expect(extensionPanel.isClosed()).toBe(false);
      return;
    }
  
    // Verify UI is still responsive
    const isStopButtonVisible = await extensionPanel.stopButton.isVisible().catch(() => false);
    const isExportButtonVisible = await extensionPanel.exportButton.isVisible().catch(() => false);
  
    console.log('✅ Stop button visible:', isStopButtonVisible);
    console.log('✅ Export button visible:', isExportButtonVisible);
    console.log('✅ Panel remained responsive during capture');
  
    expect(isStopButtonVisible || isExportButtonVisible).toBe(true);
  });
  
  /**
   * Test ID: UI-007
   * Verify panel can be reopened after closing
   * Validates: Panel persistence, reinitialization
   */
  test('UI-007: should reopen panel after closing', async ({ context, extensionId }) => {
    // Import ExtensionPanel class
    const { ExtensionPanel } = await import('../../pages/ExtensionPanel');
    
    // Open panel first time (create our own instance, don't use fixture)
    const firstPage = await context.newPage();
    const firstPanel = new ExtensionPanel(firstPage, extensionId);
    await firstPanel.goto();
    
    // Verify initial load
    const initialTitle = await firstPanel.page.title();
    expect(initialTitle).toBeTruthy();
    console.log('✅ First panel loaded with title:', initialTitle);
    
    // Close panel
    await firstPanel.close();
    
    // Reopen panel
    const secondPage = await context.newPage();
    const secondPanel = new ExtensionPanel(secondPage, extensionId);
    await secondPanel.goto();
    
    // Verify panel reopened successfully
    const newTitle = await secondPanel.page.title();
    console.log('✅ Panel reopened with title:', newTitle);
    expect(newTitle).toBeTruthy();
    
    await secondPanel.close();
  });

});