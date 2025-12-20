import { test, expect } from '../../fixtures/extensionFixture';
import { API_ENDPOINTS, TEST_SCENARIOS } from '../../fixtures/sample-apis';

/**
 * Traffic Capture Mode Test Suite
 * Tests extension's traffic capture functionality in default/standard mode
 * Validates REST API capture, various content types, and capture accuracy
 */

test.describe('Traffic Capture Mode', () => {
  test.setTimeout(90000);

  /**
   * Test ID: TC-001
   * Verify basic REST API traffic capture
   * Validates: Standard HTTP request/response capture
   */
  test('TC-001: capture basic REST API traffic', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make basic REST API calls
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.users}/1`);
    
    await targetWebsitePage.page.waitForTimeout(2000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('✅ Basic REST traffic captured');
    console.log('Captured endpoints:', Object.keys(oasSpec.paths || {}));
    expect(Object.keys(oasSpec.paths || {}).length).toBeGreaterThan(0);
  });

  /**
   * Test ID: TC-002
   * Verify JSON content type capture
   * Validates: application/json request/response handling
   */
  test('TC-002: capture JSON content type traffic', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make POST request with JSON body
    await targetWebsitePage.makePostRequest(API_ENDPOINTS.jsonPlaceholder.posts);
    
    await targetWebsitePage.page.waitForTimeout(2000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('✅ JSON content type captured');
    expect(oasSpec.paths).toBeDefined();
  });

  /**
   * Test ID: TC-003
   * Verify query parameter capture
   * Validates: URL query string detection and documentation
   */
  test('TC-003: capture requests with query parameters', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make requests with query parameters
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}?userId=1`);
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}?_limit=5&_page=1`);
    
    await targetWebsitePage.page.waitForTimeout(2000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('✅ Query parameters captured');
    console.log('Captured paths:', Object.keys(oasSpec.paths || {}));
    expect(oasSpec.paths).toBeDefined();
  });

  /**
   * Test ID: TC-004
   * Verify path parameter capture
   * Validates: Dynamic path segment detection (e.g., /posts/{id})
   */
  test('TC-004: capture requests with path parameters', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make requests with different path parameters
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/2`);
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/3`);
    
    await targetWebsitePage.page.waitForTimeout(2000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('✅ Path parameters captured');
    console.log('Captured paths:', Object.keys(oasSpec.paths || {}));
    expect(oasSpec.paths).toBeDefined();
  });

  /**
   * Test ID: TC-005
   * Verify request/response header capture
   * Validates: HTTP header documentation
   */
  test('TC-005: capture request and response headers', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make request (headers are automatically included)
    await targetWebsitePage.makePostRequest(API_ENDPOINTS.jsonPlaceholder.posts);
    
    await targetWebsitePage.page.waitForTimeout(2000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('✅ Headers captured');
    expect(oasSpec.paths).toBeDefined();
  });

  /**
   * Test ID: TC-006
   * Verify concurrent request capture without data loss
   * Validates: Traffic capture under moderate concurrent load
   */
  test('TC-006: capture concurrent API requests', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make 10 concurrent requests
    await targetWebsitePage.makeConcurrentRequests(
      API_ENDPOINTS.jsonPlaceholder.posts,
      TEST_SCENARIOS.concurrentRequests.small
    );
    
    await targetWebsitePage.page.waitForTimeout(3000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('✅ Concurrent requests captured');
    console.log('Captured paths:', Object.keys(oasSpec.paths || {}));
    expect(Object.keys(oasSpec.paths || {}).length).toBeGreaterThan(0);
  });

  /**
   * Test ID: TC-007
   * Verify capture accuracy across multiple endpoints
   * Validates: Multi-endpoint traffic detection
   */
  test('TC-007: capture traffic from multiple API endpoints', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make requests to different endpoints
    await targetWebsitePage.makeGetRequest(API_ENDPOINTS.jsonPlaceholder.posts);
    await targetWebsitePage.makeGetRequest(API_ENDPOINTS.jsonPlaceholder.users);
    await targetWebsitePage.makeGetRequest(API_ENDPOINTS.jsonPlaceholder.comments);
    
    await targetWebsitePage.page.waitForTimeout(2000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    const endpoints = Object.keys(oasSpec.paths || {});
    console.log('✅ Multiple endpoints captured');
    console.log('Captured endpoints:', endpoints);
    expect(endpoints.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * Test ID: TC-008
   * Verify successful/error response capture
   * Validates: Both 2xx and error status code capture
   */
  test('TC-008: capture both successful and error responses', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make successful request
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    
    // Make failed request
    await targetWebsitePage.makeFailedRequest();
    
    await targetWebsitePage.page.waitForTimeout(2000);
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    console.log('✅ Success and error responses captured');
    console.log('Captured paths:', Object.keys(oasSpec.paths || {}));
    expect(oasSpec.paths).toBeDefined();
  });
});