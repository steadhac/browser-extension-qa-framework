export const API_ENDPOINTS = {
  jsonPlaceholder: {
    base: 'https://jsonplaceholder.typicode.com',
    posts: 'https://jsonplaceholder.typicode.com/posts',
    users: 'https://jsonplaceholder.typicode.com/users',
    comments: 'https://jsonplaceholder.typicode.com/comments',
    albums: 'https://jsonplaceholder.typicode.com/albums',
    photos: 'https://jsonplaceholder.typicode.com/photos',
  },
  httpStat: {
    timeout: 'https://httpstat.us/200?sleep=10000',
    status404: 'https://jsonplaceholder.typicode.com/invalid-endpoint-404',
    status500: 'https://httpstat.us/500',
  }
};

export const SAMPLE_REQUEST_BODIES = {
  simplePost: {
    title: 'test post',
    body: 'test content',
    userId: 1
  },
  updatedPost: {
    title: 'updated post',
    body: 'updated content',
    userId: 1
  },
  patchedPost: {
    title: 'patched post'
  },
  largePayload: {
    data: 'x'.repeat(10 * 1024 * 1024) // 10MB
  },
  invalidJson: '{this is not valid json}'
};

export const SECURITY_TEST_QUERIES = {
  xssAttempt: '?filter=<script>alert("xss")</script>',
  unicodeChars: '?q=中文字符',
  pathTraversal: '?path=../../../etc/passwd',
  emoji: '?emoji=🚀💥',
  sqlInjection: '?id=1\' OR \'1\'=\'1',
  commandInjection: '?cmd=; ls -la',
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD'
} as const;

export const GRAPHQL_ENDPOINTS = {
  countries: 'https://countries.trevorblades.com/',
  // Add more GraphQL endpoints as needed
};

export const TEST_SCENARIOS = {
  concurrentRequests: {
    small: 10,
    medium: 50,
    large: 100,
    stress: 500
  },
  timeouts: {
    short: 2000,
    medium: 5000,
    long: 10000
  }
};

export const GRAPHQL_QUERIES = {
  simpleQuery: `{
  countries {
    code
    name
  }
}`,
  mutation: `{
  continent(code: "AF") {
    name
  }
}`
};