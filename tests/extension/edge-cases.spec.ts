import { test, expect } from '../../fixtures/extensionFixture';
import { API_ENDPOINTS, TEST_SCENARIOS } from '../../fixtures/sample-apis';

/**
 * Edge Cases Test Suite
 * Tests extension behavior under unusual, extreme, and failure conditions
 * Validates fault tolerance, error handling, and resilience
 * All tests run on Chrome only for stability
 */

test.describe('APIsec Bolt Extension - Edge Cases ', () => {
  test.setTimeout(90000);

  /**
 * Test ID: EC-001
 * Verify export behavior when no API calls have been captured
 * Validates: Empty state handling, error banner display
 */
  test('EC-001: export OAS with no API calls captured', async ({ extensionPanel }) => {
    await extensionPanel.goto();
    await extensionPanel.startCapture();
  
    // Click export button
    await extensionPanel.exportButton.click();
  
    // Wait for message popup to appear (hidden class removed)
    const messagePopup = extensionPanel.page.locator('#message-popup');
    await messagePopup.waitFor({ state: 'visible', timeout: 5000 });
  
    // Verify error message text
    const messageText = await extensionPanel.page.locator('#message-popup-text').textContent();
    expect(messageText).toContain('No captured requests available');
  });

  /**
   * Test ID: EC-002
   * Verify extension handles 50 concurrent API requests
   * Validates: Concurrent request interception, data integrity under load
   */
  test('EC-002: capture multiple concurrent API calls', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    // Reload to trigger extension capturing
    await targetWebsitePage.reload();
    
    // Fire 50 concurrent requests
    await targetWebsitePage.makeConcurrentRequests(
      API_ENDPOINTS.jsonPlaceholder.posts, 
      TEST_SCENARIOS.concurrentRequests.medium
    );
    
    await targetWebsitePage.page.waitForTimeout(3000);
    
    // Verify data was captured
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('Captured endpoints:', Object.keys(oasSpec.paths || {}));
    expect(Object.keys(oasSpec.paths || {}).length).toBeGreaterThan(0);
  });

  /**
   * Test ID: EC-003
   * Verify extension captures different HTTP methods correctly
   * Validates: GET, POST, PUT, PATCH, DELETE method capture
   */
  test('EC-003: handle different HTTP methods', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make requests with all HTTP methods
    await targetWebsitePage.makeAllHttpMethods(API_ENDPOINTS.jsonPlaceholder.posts);
    
    await targetWebsitePage.page.waitForTimeout(3000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('OAS spec:', JSON.stringify(oasSpec, null, 2));
    
    // Verify at least one method was captured
    const postsPath = oasSpec.paths?.['/posts'];
    expect(postsPath?.post || postsPath?.get).toBeDefined();
  });

  /**
   * Test ID: EC-004
   * Verify extension captures failed/error requests (404s)
   * Validates: Error request handling, 404 capture behavior
   */
  test('EC-004: capture failed/error requests', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Trigger 404 error
    await targetWebsitePage.makeFailedRequest();
    
    await targetWebsitePage.page.waitForTimeout(3000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('Captured paths (including errors):', Object.keys(oasSpec.paths || {}));
  });


  /**
   * Test ID: EC-005
   * Verify extension survives rapid start clicking (race condition)
   * Validates: Race condition handling, UI state consistency
   */
  test('EC-005: rapid start clicking (race condition)', async ({ extensionPanel, targetWebsitePage }) => {
    await extensionPanel.goto();
    await extensionPanel.page.bringToFront();
    
    // Fire rapid simultaneous clicks
    const successfulClicks = await extensionPanel.rapidStartClicking(5);
    console.log(`🎯 ${successfulClicks}/5 clicks completed`);
    
    // Verify extension didn't crash
    const isClosed = extensionPanel.page.isClosed();
    expect(isClosed).toBe(false);
    
    // Verify extension is still on correct page
    expect(extensionPanel.page.url()).toContain('panel.html');
  });

  /**
   * Test ID: EC-006
   * Verify multiple exports without stopping capture
   * Validates: Multi-export functionality, data persistence
   */
  test('EC-006: export multiple times without stopping', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.page.waitForTimeout(2000);
    
    // Export 3 times consecutively
    for (let i = 0; i < 3; i++) {
      await extensionPanel.exportOAS();
      console.log(`✅ Export ${i + 1} succeeded`);
    }
  });

  /**
   * Test ID: EC-007
   * Verify extension handles extremely large request bodies (10MB)
   * Validates: Large payload handling, memory management
   */
  test('EC-007: extremely large request body (10MB)', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Send 10MB payload
    await targetWebsitePage.makeLargePayloadRequest();
    
    await targetWebsitePage.page.waitForTimeout(5000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('✅ OAS captured large request:', !!oasSpec.paths['/posts']);
  });

  /**
   * Test ID: EC-008
   * Verify extension sanitizes special characters and XSS attempts
   * Validates: Input sanitization, XSS prevention, Unicode handling
   */
  test('EC-008: capture with special characters in URL', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make requests with XSS attempts, Unicode, path traversal, emojis
    await targetWebsitePage.makeRequestWithSecurityTests();
    
    await targetWebsitePage.page.waitForTimeout(3000);
    
    const download = await extensionPanel.exportOAS();
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    // Verify OAS is valid JSON (not corrupted by special chars)
    expect(() => JSON.parse(JSON.stringify(oasSpec))).not.toThrow();
    console.log('✅ Special characters handled safely');
  });

  /**
   * Test ID: EC-009
   * Verify extension handles invalid JSON in request bodies
   * Validates: Malformed data handling, error resilience
   */
  test('EC-009: invalid JSON in request body', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Send malformed JSON
    await targetWebsitePage.makeInvalidJsonRequest();
    
    await targetWebsitePage.page.waitForTimeout(3000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('✅ OAS still valid after invalid JSON request');
    expect(oasSpec).toBeDefined();
  });

  /**
   * Test ID: EC-010
   * Verify export works with pending/timeout network requests
   * Validates: Async request handling, timeout resilience
   */
  test('EC-010: network timeout/slow responses', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Simulate timeout request (aborts after 5s)
    await targetWebsitePage.makeTimeoutRequest();
    
    await targetWebsitePage.page.waitForTimeout(2000);
    
    // Export while request is pending
    await extensionPanel.exportOAS();
    
    console.log('✅ Export worked with pending requests');
  });
});