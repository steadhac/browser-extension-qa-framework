#!/bin/bash

# package.json
cat > package.json << 'EOF'
{
  "name": "browser-extension-qa-framework",
  "version": "1.0.0",
  "description": "Automated test suite for aposec.ai/bolt Chrome plugin",
  "main": "index.js",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:report": "playwright show-report"
  },
  "keywords": ["bolt", "api-testing", "security", "chrome-extension"],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "dotenv": "^16.3.1"
  }
}
EOF

# playwright.config.ts
cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
  },
  projects: [
    {
      name: 'chromium-with-extension',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
  ],
  timeout: 60000,
});
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node", "@playwright/test"]
  },
  "include": ["tests/**/*", "utils/**/*", "fixtures/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
test-results/
playwright-report/
.env
*.log
.DS_Store
bolt-extension/
EOF

# .env.example
cat > .env.example << 'EOF'
EXTENSION_PATH=./bolt-extension
EXTENSION_ID=
HEADLESS=false
TIMEOUT=60000
WORKERS=1
TEST_API_BASE_URL=https://jsonplaceholder.typicode.com
SECONDARY_API_URL=https://reqres.in/api
REPORT_OUTPUT_DIR=./test-results
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
EOF

# tests/setup/extension-loader.ts
cat > tests/setup/extension-loader.ts << 'EOF'
import { test as base, chromium, BrowserContext } from '@playwright/test';
import path from 'path';

type ExtensionFixtures = {
  context: BrowserContext;
  extensionId: string;
};

export const test = base.extend<ExtensionFixtures>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '../../bolt-extension');
    
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
    });
    
    await use(context);
    await context.close();
  },
  
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export { expect } from '@playwright/test';
EOF

echo "All files populated successfully!"
