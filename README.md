# APIsec BOLT Extension - Test Documentation

This directory contains comprehensive test documentation for the APIsec BOLT browser extension QA framework.

## Documentation Structure

- **[test-plan.md](docs/test-plan.md)** - Overall testing strategy, scope, and approach
- **[test-cases.md](docs/test-cases.md)** - Detailed test case specifications with IDs

## Project Structure

```text
browser-extension-qa-framework/
├── docs/ # Test documentation
│ ├── README.md # This file
│ ├── test-plan.md # Testing strategy
│ ├── test-cases.md # Detailed test cases
│ ├── test-results.md # Execution results
│ └── coverage-report.md # Coverage analysis
│
├── fixtures/ # Test fixtures and utilities
│ ├── extensionFixture.ts # Browser context with extension
│ ├── sample-apis.ts # Centralized API endpoints & test data
│ └── test-api-server.ts # Local mock API server (optional)
│
├── pages/ # Page Object Model classes
│ ├── ExtensionPanel.ts # Extension UI page object
│ └── TargetWebsite.ts # Test website page object
│
├── tests/ # Test suites
│ ├── extension/ # Extension core tests
│ │ ├── extension-loading.spec.ts # EL-001, EL-002
│ │ ├── edge-cases-pom.spec.ts # EC-001 to EC-010
│ │ └── toggle-functionality.spec.ts # TF-001 to TF-004
│ │
│ ├── integration/ # Integration tests
│ │ └── full-workflow.spec.ts # FW-001 to FW-005
│ │
│ ├── traffic-mode/ # Traffic capture tests
│ │ ├── traffic-capture.spec.ts # TC-001 to TC-008
│ │ └── graphql-capture.spec.ts # GQL-001 to GQL-005
│ │
│ ├── ui/ # UI tests
│ │ └── plugin-ui.spec.ts # UI-001 to UI-007
│ │
│ └── setup/ # Test setup utilities
│ └── extension-loader.ts # Extension loading helpers
│
├── resources/ # Extension under test
│ └── apiseccapture 2/ # APIsec BOLT extension
│ ├── manifest.json
│ ├── background.js
│ ├── panel.html
│ └── assets/
├── playwright.config.ts # Playwright configuration
├── package.json # Dependencies
└── tsconfig.json # TypeScript configuration
```

## Quick Reference

### Test Suites

- **Extension Loading (EL)** - Extension initialization and loading
- **Edge Cases (EC)** - Fault tolerance and error handling
- **Toggle Functionality (TF)** - Start/stop capture controls
- **Full Workflow (FW)** - End-to-end integration tests
- **Traffic Capture (TC)** - REST API traffic capture
- **GraphQL Capture (GQL)** - GraphQL API traffic capture
- **Plugin UI (UI)** - User interface testing

### Total Test Count

- **41 automated tests** across 7 test suites
- Covers Chrome (passing) and Edge (documented failures)
- Page Object Model architecture for maintainability

## Architecture Highlights

### Page Object Model (POM)

**Benefits:**

- ✅ Reusable test components
- ✅ Centralized element locators
- ✅ Easy maintenance when UI changes
- ✅ Readable, self-documenting tests

**Key Classes:**

- `ExtensionPanel` - Handles extension UI (start/stop/export)
- `TargetWebsitePage` - Makes API calls for capture testing

### Fixture-Based Testing

**Benefits:**

- ✅ Automatic browser/extension setup
- ✅ Consistent test environment
- ✅ Shared context across tests
- ✅ Clean teardown

**Main Fixture:**

```typescript
test("TC-001: ...", async ({ extensionPanel, targetWebsitePage }) => {
  // Browser and extension already loaded
  // Ready to test immediately
});
```

Centralized Test Data
Location: sample-apis.ts

### Benefits:

✅ Single source of truth for URLs
✅ No hardcoded endpoints in tests
✅ Easy to update test data
✅ Reusable across test suites

### Browser Extension QA Framework

### Overview

This project provides an automated end-to-end testing framework for the APIsec BOLT browser extension using Playwright and TypeScript. It is designed to validate extension functionality, UI, and traffic capture capabilities in a real browser environment.

### Architecture

## Playwright + TypeScript:

All tests use Playwright for browser automation and TypeScript for type safety and maintainability.

## Page Object Model (POM):

Extension UI and target website interactions are abstracted into page objects (ExtensionPanel.ts, pages/TargetWebsite.ts), making tests readable and reusable.

```TypeScript
export class ExtensionPanel {
  constructor(public page: Page) {}
  startButton = this.page.locator('#start-button');
  exportButton = this.page.locator('#stripe-download-oas');
  async startCapture() {
    await this.startButton.click();
  }
  async exportOAS() {
    const download = this.page.waitForEvent('download');
    await this.exportButton.click();
    return await download;
  }
}
```

Usage in test:

```TypeScript
await extensionPanel.startCapture();
await extensionPanel.exportOAS();
```

## Fixtures:

Custom Playwright fixtures (extensionFixture.ts) provide browser context setup, extension loading, and page object injection.
Example: extensionFixture.ts

```TypeScript
import { test as base } from '@playwright/test';
import { ExtensionPanel } from '../pages/ExtensionPanel';

export const test = base.extend({
  extensionPanel: async ({ page }, use) => {
    const panel = new ExtensionPanel(page);
    await use(panel);
  }
});
```

Usage in:
Example: extensionFixture.ts

```TypeScript
test('TC-001: ...', async ({ extensionPanel }) => {
  await extensionPanel.startCapture();
});
```

## Test Data:

API endpoints and sample data are centralized in sample-apis.ts.
Example: sample-apis.ts

```TypeScript
export const API_ENDPOINTS = {
  jsonPlaceholder: {
    base: 'https://jsonplaceholder.typicode.com',
    posts: 'https://jsonplaceholder.typicode.com/posts',
    users: 'https://jsonplaceholder.typicode.com/users'
  }
};
```

Usage in:
Example: sample-apis.ts

```TypeScript
await targetWebsitePage.goto(API_ENDPOINTS.jsonPlaceholder.base);
```

## Extension Loading:

The extension is loaded into a persistent browser context using Playwright’s launch options with --disable-extensions-except and --load-extension.
Example: Playwright launch options

```TypeScript
const extensionPath = path.join(__dirname, '../resources/apiseccapture 2');
const context = await chromium.launchPersistentContext('', {
  headless: false,
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`
  ]
});
```

## Test Patterns:

Each test follows a clear pattern: setup → action (e.g., start capture, make API call) → assertion (e.g., export OAS, check captured paths).
Example: Setup → Action → Assertion

```TypeScript
test('TC-001: should capture API traffic', async ({ extensionPanel, targetWebsitePage }) => {
  await extensionPanel.startCapture(); // Setup
  await targetWebsitePage.makeGetRequest('/posts/1'); // Action
  const oasSpec = await extensionPanel.exportAndParseOAS(); // Assertion
  expect(oasSpec.paths['/posts']).toBeDefined();
});
```

### How Extension Testing Differs from Web Page Testing

## Context:

Extension tests interact with the extension’s UI (side panel, popup, etc.) and background scripts, not just a web page.

```TypeScript
// Extension panel interaction
await extensionPanel.startCapture();
// Web page interaction
await targetWebsitePage.makeGetRequest('/posts/1');
```

## Loading:

The extension must be loaded into the browser with special launch arguments. Tests may need to extract the extension ID and handle service workers.

```TypeScript
// Special launch arguments for extension
args: [
  `--disable-extensions-except=${extensionPath}`,
  `--load-extension=${extensionPath}`
]
```

## UI Interaction:

Tests may need to switch between the extension panel and regular web pages. Selectors target extension-specific elements.

```TypeScript
// Switch between extension and web page
await extensionPanel.page.bringToFront();
await targetWebsitePage.page.bringToFront();
```

## Traffic Capture:

The extension can observe and capture browser traffic from any tab, not just its own. Tests verify that the extension correctly intercepts and exports this traffic.

```TypeScript
// Extension captures traffic from any tab
await targetWebsitePage.makeGetRequest('/posts/1');
const oasSpec = await extensionPanel.exportAndParseOAS();
```

## State Management:

Extensions may require explicit reset between tests (e.g., clicking a "New" button) to clear captured data and UI state.

```TypeScript
// manifest.json
"permissions": ["webRequest", "storage", "tabs"]
```

## Permissions:

Extensions require permissions in manifest.json to access browser APIs. Tests may need to verify permission handling.

```TypeScript
// manifest.json
"permissions": ["webRequest", "storage", "tabs"]
```

## Test Complexity:

Extension tests are more complex due to privileged APIs, context switching, and coordination between extension UI and web content.

```TypeScript
// Coordinating extension and web page actions
await extensionPanel.startCapture();
await targetWebsitePage.makeGetRequest('/posts/1');
await extensionPanel.exportOAS();
```

## Example Test Flow

Load the extension in a browser context.
Navigate to a target website.
Start capture in the extension panel.
Trigger API calls from the target website.
Export captured traffic as an OpenAPI (OAS) file.
Assert on the contents of the exported OAS.
Click "New" in the extension to reset for the next test cycle.

## Folder Structure

```text
/pages                # Page objects for extension and target website
/fixtures             # Playwright fixtures and test data
/tests                # Test suites organized by feature
/docs                 # Documentation, test plan, and test cases
/resources            # Extension source code (not public)
```

### Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run specific suite
npx playwright test tests/extension/edge-cases-pom.spec.ts

# Run by test ID
npx playwright test -g "EC-001"

# Run with UI visible (headed mode)
npx playwright test --headed

# View HTML report
npx playwright show-report

# Run specific test file
npx playwright test tests/ui/plugin-ui.spec.ts
```

### Test Execution Flow

Setup - Playwright launches browser with extension loaded
Test - Page objects interact with extension and websites
Validation - Assertions verify expected behavior
Teardown - Browser context closes automatically
Report - Results saved to HTML report

### Technology Stack

Framework: Playwright with TypeScript
Pattern: Page Object Model (POM)
Browsers: Chrome (primary), Edge (compatibility)
Architecture: Fixture-based test organization
Reporting: HTML reports with screenshots/videos on failure

### Contributing

When adding new tests:

Follow the POM pattern (use page objects)
Add test IDs (e.g., TC-009)
Use centralized constants from sample-apis.ts
Document tests with JSDoc comments
Update test-cases.md documentation

### 📄 License

MIT License - See LICENSE file for details
---

## 👤 Author

**Carolina Steadham**
- GitHub: [@steadhac](https://github.com/steadhac)
- LinkedIn: [Carolina Steadham](https://linkedin.com/in/carolinacsteadham)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ and Python
