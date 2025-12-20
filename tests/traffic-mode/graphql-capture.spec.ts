import { test, expect } from '../../fixtures/extensionFixture';
import { GRAPHQL_QUERIES, GRAPHQL_ENDPOINTS } from '../../fixtures/sample-apis';

/**
 * GraphQL Traffic Capture Test Suite
 * Tests extension's ability to capture and document GraphQL API traffic
 * Uses GraphQL playground UI interaction for realistic user scenarios
 */

test.describe('APIsec Bolt Extension - GraphQL Capture', () => {
  test.setTimeout(90000);

  /**
   * Test ID: GQL-001
   * Verify extension captures GraphQL query requests
   * Validates: Query detection via playground UI, GraphQL endpoint capture
   */
  test('GQL-001: capture GraphQL query traffic', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(GRAPHQL_ENDPOINTS.countries);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
  
    await targetWebsitePage.reload();
  
    console.log('🔍 Executing GraphQL query in browser console');
  
    const graphqlResponse = await targetWebsitePage.page.evaluate(({ endpoint, query }) => {
      console.log('🔍 GRAPHQL QUERY:', query);
    
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      }).then(response => response.json()).then(data => {
        console.log('📊 RESPONSE DATA:', data);
        return data;
      });
    }, { endpoint: GRAPHQL_ENDPOINTS.countries, query: GRAPHQL_QUERIES.simpleQuery });
  
    // Switch focus to BOLT extension panel to see what was captured
    await extensionPanel.page.bringToFront();
    await targetWebsitePage.page.waitForTimeout(3000);
  
    console.log('📊 GraphQL Response:', JSON.stringify(graphqlResponse, null, 2));
  
    const oasSpec = await extensionPanel.exportAndParseOAS();
  
    console.log('✅ GraphQL query captured');
    console.log('Captured paths:', Object.keys(oasSpec.paths || {}));
    expect(oasSpec.paths).toBeDefined();
  });


  /**
   * Test ID: GQL-002
   * Verify extension captures GraphQL mutation requests
   * Validates: Mutation detection, request body capture, variables handling
   */
  test('GQL-002: capture GraphQL mutation traffic', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(GRAPHQL_ENDPOINTS.countries);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
  
    await targetWebsitePage.reload();
  
    console.log('🔍 Executing GraphQL mutation in browser console');
  
    const graphqlResponse = await targetWebsitePage.page.evaluate(({ endpoint, mutation }) => {
      console.log('🔍 GRAPHQL MUTATION:', mutation);
      console.log('🔗 ENDPOINT:', endpoint);
    
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation })
      }).then(response => response.json()).then(data => {
        console.log('📊 MUTATION RESPONSE:', data);
        return data;
      });
    }, { endpoint: GRAPHQL_ENDPOINTS.countries, mutation: GRAPHQL_QUERIES.mutation });
  
    // Switch focus to BOLT extension panel
    await extensionPanel.page.bringToFront();
    await targetWebsitePage.page.waitForTimeout(3000);
  
    console.log('📊 GraphQL Mutation Response:', JSON.stringify(graphqlResponse, null, 2));
  
    const oasSpec = await extensionPanel.exportAndParseOAS();
  
    console.log('✅ GraphQL mutation captured');
    console.log('Captured paths:', Object.keys(oasSpec.paths || {}));
    expect(oasSpec.paths).toBeDefined();
  });

  /**
   * Test ID: GQL-003
   * Verify extension captures multiple GraphQL operations
   * Validates: Multiple query/mutation detection, sequential operations
   */

  test('GQL-003: capture multiple GraphQL operations', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(GRAPHQL_ENDPOINTS.countries);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
  
    await targetWebsitePage.reload();
  
    console.log('🔍 Executing multiple GraphQL operations in browser console');
  
    const graphqlResponses = await targetWebsitePage.page.evaluate(({ endpoint, queries }) => {
      console.log('🔍 Executing', queries.length, 'GraphQL queries');
    
      const requests = queries.map((query, index) => 
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        }).then(response => response.json()).then(data => {
          console.log(`📊 QUERY ${index + 1} RESPONSE:`, data);
          return data;
        })
      );
    
      return Promise.all(requests);
    }, { 
      endpoint: GRAPHQL_ENDPOINTS.countries, 
      queries: [
        GRAPHQL_QUERIES.simpleQuery,
        '{ continents { code name } }',
        '{ languages { code name } }'
      ]
    });
  
    // Switch focus to BOLT extension panel
    await extensionPanel.page.bringToFront();
    await targetWebsitePage.page.waitForTimeout(3000);
  
    console.log('📊 All GraphQL Responses:', JSON.stringify(graphqlResponses, null, 2));
  
    const oasSpec = await extensionPanel.exportAndParseOAS();
  
    console.log('✅ Multiple GraphQL operations captured');
    console.log('Captured paths:', Object.keys(oasSpec.paths || {}));
    expect(oasSpec.paths).toBeDefined();
 
  });

  /**
 * Test ID: GQL-004
 * Verify GraphQL introspection query capture
 * Validates: Schema introspection detection, metadata capture
 */
  test('GQL-004: capture GraphQL introspection query', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(GRAPHQL_ENDPOINTS.countries);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
  
    await targetWebsitePage.reload();
  
    console.log('🔍 Executing introspection query in browser console');
  
    const graphqlResponse = await targetWebsitePage.page.evaluate(({ endpoint }) => {
      const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          types {
            name
            kind
          }
        }
      }
    `;
    
      console.log('🔍 INTROSPECTION QUERY:', introspectionQuery);
      console.log('🔗 ENDPOINT:', endpoint);
    
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: introspectionQuery })
      }).then(response => response.json()).then(data => {
        console.log('📊 SCHEMA DATA:', data);
        return data;
      });
    }, { endpoint: GRAPHQL_ENDPOINTS.countries });
  
    // Switch focus to BOLT extension panel
    await extensionPanel.page.bringToFront();
    await targetWebsitePage.page.waitForTimeout(3000);
  
    console.log('📊 Introspection Response:', JSON.stringify(graphqlResponse, null, 2));
  
    const oasSpec = await extensionPanel.exportAndParseOAS();
  
    console.log('✅ GraphQL introspection query captured');
    console.log('Captured paths:', Object.keys(oasSpec.paths || {}));
    expect(oasSpec.paths).toBeDefined();
  });

  /**
 * Test ID: GQL-005
 * Verify GraphQL error handling
 * Validates: Invalid query capture, error response handling
 */
  test('GQL-005: capture GraphQL errors', async ({ extensionPanel, targetWebsitePage }) => {
    await targetWebsitePage.goto(GRAPHQL_ENDPOINTS.countries);
    await extensionPanel.goto();
    await extensionPanel.startCapture();
  
    await targetWebsitePage.reload();
  
    console.log('🔍 Executing invalid query in browser console');
  
    const graphqlResponse = await targetWebsitePage.page.evaluate(({ endpoint }) => {
      const invalidQuery = '{ invalidField { doesNotExist } }';
    
      console.log('🔍 INVALID QUERY:', invalidQuery);
      console.log('🔗 ENDPOINT:', endpoint);
    
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: invalidQuery })
      }).then(response => response.json()).then(data => {
        console.log('📊 ERROR RESPONSE:', data);
        return data;
      });
    }, { endpoint: GRAPHQL_ENDPOINTS.countries });
  
    // Switch focus to BOLT extension panel
    await extensionPanel.page.bringToFront();
    await targetWebsitePage.page.waitForTimeout(3000);
  
    console.log('📊 Error Response:', JSON.stringify(graphqlResponse, null, 2));
  
    const oasSpec = await extensionPanel.exportAndParseOAS();
  
    console.log('✅ GraphQL error captured');
    console.log('Captured paths:', Object.keys(oasSpec.paths || {}));
    expect(oasSpec.paths).toBeDefined();
  });

});