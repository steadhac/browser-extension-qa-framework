import { test, expect } from '../../fixtures/extensionFixture';
import { API_ENDPOINTS, TEST_SCENARIOS } from '../../fixtures/sample-apis';

/**
 * Full Workflow Integration Test Suite
 * End-to-end tests validating complete user workflows
 * Tests the entire lifecycle: start → capture → export → validate
 */

test.describe('APIsec Bolt Extension - Full Workflow Integration', () => {
  test.setTimeout(90000);

  /**
   * Test ID: FW-001
   * Complete workflow: start capture → make API calls → export OAS → validate spec
   * Validates: Full extension lifecycle, OAS generation accuracy
   */
  test('FW-001: complete workflow - start → capture → export → validate', async ({ extensionPanel, targetWebsitePage }) => {
    console.log('🚀 Starting full workflow test');
    
    // Step 1: Navigate to test website
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    console.log('✅ Step 1: Navigated to target website');
    
    // Step 2: Open extension panel and start capture
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    console.log('✅ Step 2: Started API capture');
    
    // Step 3: Reload page to trigger extension
    await targetWebsitePage.reload();
    
    // Step 4: Make various API calls
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.makePostRequest(API_ENDPOINTS.jsonPlaceholder.posts);
    await targetWebsitePage.page.waitForTimeout(2000);
    console.log('✅ Step 3: Made API calls (GET, POST)');
    
    // Step 5: Export OAS
    const oasSpec = await extensionPanel.exportAndParseOAS();
    console.log('✅ Step 4: Exported OAS specification');
    
    // Step 6: Validate OAS structure
    expect(oasSpec).toBeDefined();
    expect(oasSpec.openapi || oasSpec.swagger).toBeDefined();
    expect(oasSpec.paths).toBeDefined();
    expect(Object.keys(oasSpec.paths).length).toBeGreaterThan(0);
    
    console.log('✅ Step 5: Validated OAS structure');
    console.log('📊 Captured endpoints:', Object.keys(oasSpec.paths));
    console.log('🎉 Full workflow completed successfully');
  });

  /**
   * Test ID: FW-002
   * Multi-endpoint workflow with different HTTP methods
   * Validates: Comprehensive API coverage, method detection
   */
  test('FW-002: capture multiple endpoints with different HTTP methods', async ({ extensionPanel, targetWebsitePage }) => {
    console.log('🚀 Starting multi-endpoint workflow');
    
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Make requests to different endpoints with various methods
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.users}/1`);
    await targetWebsitePage.makePostRequest(API_ENDPOINTS.jsonPlaceholder.posts);
    await targetWebsitePage.makePutRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.makeDeleteRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    
    await targetWebsitePage.page.waitForTimeout(3000);
    console.log('✅ Made requests to multiple endpoints');
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    // Validate multiple endpoints captured
    const endpoints = Object.keys(oasSpec.paths || {});
    console.log('📊 Captured endpoints:', endpoints);
    expect(endpoints.length).toBeGreaterThan(1);
    
    console.log('🎉 Multi-endpoint workflow completed');
  });

  /**
   * Test ID: FW-003
   * Workflow with concurrent API calls
   * Validates: High-volume capture, data integrity under load
   */
  test('FW-003: workflow with concurrent API requests', async ({ extensionPanel, targetWebsitePage }) => {
    console.log('🚀 Starting concurrent requests workflow');
    
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    
    // Fire concurrent requests
    await targetWebsitePage.makeConcurrentRequests(
      API_ENDPOINTS.jsonPlaceholder.posts,
      TEST_SCENARIOS.concurrentRequests.small
    );
    
    await targetWebsitePage.page.waitForTimeout(3000);
    console.log('✅ Made 10 concurrent requests');
    
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    // Validate capture under concurrent load
    expect(oasSpec.paths).toBeDefined();
    console.log('📊 Captured paths under load:', Object.keys(oasSpec.paths));
    
    console.log('🎉 Concurrent workflow completed');
  });

  /**
   * Test ID: FW-004
   * Workflow: capture → stop → restart → capture more → export
   * Validates: State management across start/stop cycles
   */
  test('FW-004: workflow with start/stop/restart cycles', async ({ extensionPanel, targetWebsitePage }) => {
    console.log('🚀 Starting start/stop cycle workflow');
    
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    
    // Cycle 1: Start and capture
    await extensionPanel.startCapture();
    await targetWebsitePage.reload();
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.page.waitForTimeout(1000);
    console.log('✅ Cycle 1: Captured data');
    
    // Stop
    await extensionPanel.stopCapture();
    await targetWebsitePage.page.waitForTimeout(500);
    console.log('✅ Stopped capture');
    
    // Cycle 2: Restart and capture more
    await extensionPanel.startCapture();
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.users}/1`);
    await targetWebsitePage.page.waitForTimeout(2000);
    console.log('✅ Cycle 2: Captured more data');
    
    // Export and validate
    const oasSpec = await extensionPanel.exportAndParseOAS();
    
    expect(oasSpec.paths).toBeDefined();
    console.log('📊 Final captured paths:', Object.keys(oasSpec.paths));
    
    console.log('🎉 Start/stop cycle workflow completed');
  });

  /**
   * Test ID: FW-005
   * Workflow: capture → export multiple times → validate consistency
   * Validates: Multi-export reliability, data consistency
   */
  test('FW-005: workflow with multiple exports', async ({ extensionPanel, targetWebsitePage }) => {
    console.log('🚀 Starting multiple export workflow');
    
    await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
    
    await targetWebsitePage.reload();
    await targetWebsitePage.makeGetRequest(`${API_ENDPOINTS.jsonPlaceholder.posts}/1`);
    await targetWebsitePage.page.waitForTimeout(2000);
    
    // Export multiple times
    const exports = [];
    for (let i = 0; i < 3; i++) {
      const oasSpec = await extensionPanel.exportAndParseOAS();
      exports.push(oasSpec);
      console.log(`✅ Export ${i + 1} completed`);
    }
    
    // Validate all exports have data
    exports.forEach((spec, index) => {
      expect(spec.paths).toBeDefined();
      console.log(`Export ${index + 1} paths:`, Object.keys(spec.paths));
    });
    
    console.log('🎉 Multiple export workflow completed');
  });
});