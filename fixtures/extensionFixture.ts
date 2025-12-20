import { test as base, chromium, BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ExtensionPanel } from '../pages/ExtensionPanel';
import { TargetWebsitePage } from '../pages/TargetWebsitePage';
import { GraphQLPlayground } from '../pages/GraphQLPlayground';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type ExtensionFixtures = {
  context: BrowserContext;
  extensionId: string;
  extensionPanel: ExtensionPanel;
  targetWebsitePage: TargetWebsitePage;
  graphqlPlayground: GraphQLPlayground; 
};

export const test = base.extend<ExtensionFixtures>({
  context: async ({}, use) => {
    const extensionPath = path.join(__dirname, '../resources/apiseccapture 2');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--enable-extension-activity-logging'
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
      acceptDownloads: true
    });

    await use(context);
    await context.close();
  },

  extensionId: async ({ context }, use) => {
    const page = await context.newPage();
    await page.waitForTimeout(2000);
    
    const serviceWorkers = context.serviceWorkers();
    const swUrl = serviceWorkers[0]?.url();
    const extensionId = swUrl?.match(/chrome-extension:\/\/([a-zA-Z0-9]+)\//)?.[1]!;
    
    await page.close();
    await use(extensionId);
  },

  extensionPanel: async ({ context, extensionId }, use) => {
    const page = await context.newPage();
    const panel = new ExtensionPanel(page, extensionId);
    await use(panel);
  },

  targetWebsitePage: async ({ context }, use) => {
    const page = await context.newPage();
    const targetWebsitePage = new TargetWebsitePage(page);
    await use(targetWebsitePage);
  },

  graphqlPlayground: async ({ context }, use) => {
    const page = await context.newPage();
    const playground = new GraphQLPlayground(page);
    await use(playground);
  }
});

export { expect } from '@playwright/test';