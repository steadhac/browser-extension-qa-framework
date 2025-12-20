import { test, expect, chromium, BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { ExtensionPanel } from '../../pages/ExtensionPanel';

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extension Loading Test Suite
 * Tests extension loading and initialization across Chrome and Edge browsers
 * Chrome: Expected to pass (extension is Chrome-compatible)
 * Edge: Expected to fail (documents Chrome-only limitation)
 */

const browsers = [
  { name: 'Chrome', channel: undefined, shouldPass: true },
  { name: 'Edge', channel: 'msedge' as const, shouldPass: false }
];

browsers.forEach(({ name, channel, shouldPass }) => {
  test.describe(`Extension Loading - ${name}`, () => {
    // Use Node.js globals for CommonJS compatibility
    const extensionPath = path.join(__dirname, '../resources/apiseccapture 2');
    let context: BrowserContext;
    let extensionId: string;
    let extensionPanel: ExtensionPanel;

    test.setTimeout(90000);

    /**
     * Setup: Launch browser with extension loaded
     * Extracts extension ID from service worker URL
     */
    test.beforeEach(async () => {
      const launchOptions: any = {
        headless: false,
        args: [
          `--disable-extensions-except=${extensionPath}`,
          `--load-extension=${extensionPath}`,
          '--enable-extension-activity-logging'
        ],
        ignoreDefaultArgs: ['--disable-extensions'],
        acceptDownloads: true
      };

      // Use specific channel for Edge, default Chromium for Chrome
      if (channel) {
        launchOptions.channel = channel;
      }

      context = await chromium.launchPersistentContext('', launchOptions);

      // Wait for extension to initialize
      const page = await context.newPage();
      await page.waitForTimeout(2000);
      
      // Extract extension ID from service worker URL
      const serviceWorkers = context.serviceWorkers();
      const swUrl = serviceWorkers[0]?.url();
      extensionId = swUrl?.match(/chrome-extension:\/\/([a-zA-Z0-9]+)\//)?.[1]!;
      
      await page.close();
    });

    test.afterEach(async () => {
      await context.close();
    });

    const testFn = shouldPass ? test : test.fail;

    /**
     * Test ID: EL-001
     * Verify extension service worker loads successfully
     * Validates: Service worker registration and extension ID extraction
     */
    testFn(`EL-001: should load extension successfully in ${name}`, async () => {
      const serviceWorkers = context.serviceWorkers();
      
      // Verify at least one service worker is registered
      expect(serviceWorkers.length).toBeGreaterThan(0);
      
      // Verify extension ID was extracted
      expect(extensionId).toBeDefined();
      
      console.log(`${name}: Extension ID - ${extensionId}`);
    });

    /**
     * Test ID: EL-002
     * Verify extension UI pages are accessible
     * Validates: panel.html loads and displays correctly
     */
    testFn(`EL-002: should have extension pages accessible in ${name}`, async () => {
      expect(extensionId).toBeDefined();
      
      // Create ExtensionPanel page object
      const page = await context.newPage();
      extensionPanel = new ExtensionPanel(page, extensionId);
      
      // Navigate to extension panel
      await extensionPanel.goto();
      
      // Verify page loaded with title
      const title = await extensionPanel.page.title();
      console.log(`${name} panel page title:`, title);
      expect(title).toBeTruthy();
      
      // Cleanup
      await extensionPanel.close();
    });
  });
});