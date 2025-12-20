import { Page } from '@playwright/test';
import { API_ENDPOINTS, SAMPLE_REQUEST_BODIES, SECURITY_TEST_QUERIES } from '../fixtures/sample-apis';

export class TargetWebsitePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string = API_ENDPOINTS.jsonPlaceholder.base) {
    await this.page.goto(url);
    await this.page.waitForTimeout(2000);
  }

  async reload() {
    await this.page.reload();
    await this.page.waitForTimeout(2000);
  }

  async makeGetRequest(url: string) {
    return await this.page.evaluate((apiUrl) => fetch(apiUrl), url);
  }

  async makePostRequest(url: string, data?: any) {
    return await this.page.evaluate(({ apiUrl, body }) => {
      return fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
      });
    }, { apiUrl: url, body: data || SAMPLE_REQUEST_BODIES.simplePost });
  }

  async makePutRequest(url: string, data?: any) {
    return await this.page.evaluate(({ apiUrl, body }) => {
      return fetch(apiUrl, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
      });
    }, { apiUrl: url, body: data || SAMPLE_REQUEST_BODIES.updatedPost });
  }

  async makePatchRequest(url: string, data?: any) {
    return await this.page.evaluate(({ apiUrl, body }) => {
      return fetch(apiUrl, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
      });
    }, { apiUrl: url, body: data || SAMPLE_REQUEST_BODIES.patchedPost });
  }

  async makeDeleteRequest(url: string) {
    return await this.page.evaluate((apiUrl) => fetch(apiUrl, { method: 'DELETE' }), url);
  }

  async makeConcurrentRequests(baseUrl: string, count: number) {
    await this.page.evaluate(({ url, num }) => {
      const promises = [];
      for (let i = 1; i <= num; i++) {
        promises.push(fetch(`${url}/${i}`));
      }
      return Promise.all(promises);
    }, { url: baseUrl, num: count });
  }

  async makeAllHttpMethods(baseUrl: string = API_ENDPOINTS.jsonPlaceholder.posts) {
    await this.page.evaluate((url) => {
      fetch(url, { method: 'POST', body: JSON.stringify({ title: 'test' }) });
      fetch(`${url}/1`, { method: 'PUT', body: JSON.stringify({ title: 'updated' }) });
      fetch(`${url}/1`, { method: 'PATCH', body: JSON.stringify({ title: 'patched' }) });
      fetch(`${url}/1`, { method: 'DELETE' });
    }, baseUrl);
  }

  async makeRequestWithSecurityTests(baseUrl: string = API_ENDPOINTS.jsonPlaceholder.posts) {
    await this.page.evaluate(({ url, queries }) => {
      Object.values(queries).forEach(query => {
        fetch(`${url}${query}`).catch(() => {});
      });
    }, { url: baseUrl, queries: SECURITY_TEST_QUERIES });
  }

  async makeInvalidJsonRequest(url: string = API_ENDPOINTS.jsonPlaceholder.posts) {
    return await this.page.evaluate(({ apiUrl, body }) => {
      return fetch(apiUrl, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' }
      });
    }, { apiUrl: url, body: SAMPLE_REQUEST_BODIES.invalidJson });
  }

  async makeLargePayloadRequest(url: string = API_ENDPOINTS.jsonPlaceholder.posts) {
    return await this.page.evaluate(({ apiUrl, body }) => {
      return fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
      }).catch(e => console.log('Large request failed:', e));
    }, { apiUrl: url, body: SAMPLE_REQUEST_BODIES.largePayload });
  }

  async makeTimeoutRequest(url: string = API_ENDPOINTS.httpStat.timeout, timeoutMs: number = 5000) {
    return await this.page.evaluate(({ apiUrl, timeout }) => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), timeout);
      
      return fetch(apiUrl, { signal: controller.signal })
        .catch(e => console.log('Request aborted/timeout:', e));
    }, { apiUrl: url, timeout: timeoutMs });
  }

  async makeFailedRequest(url: string = API_ENDPOINTS.httpStat.status404) {
    return await this.page.evaluate((apiUrl) => fetch(apiUrl), url);
  }
  
  async makeGraphQLQuery(endpoint: string, query: string, variables?: any) {
    return await this.page.evaluate(({ url, gqlQuery, vars }) => {
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: gqlQuery, variables: vars })
      });
    }, { url: endpoint, gqlQuery: query, vars: variables });
  }

  async makeGraphQLMutation(endpoint: string, mutation: string, variables: any) {
    return await this.makeGraphQLQuery(endpoint, mutation, variables);
  }

  async makeMultipleGraphQLQueries(endpoint: string, queries: string[]) {
    return await this.page.evaluate(({ url, gqlQueries }) => {
      const requests = gqlQueries.map(query => 
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        })
      );
      return Promise.all(requests);
    }, { url: endpoint, gqlQueries: queries });
  }

  async close() {
    if (!this.page.isClosed()) {
      await this.page.close();
    }
  }
}