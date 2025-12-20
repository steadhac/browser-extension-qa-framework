import { test, expect, chromium, BrowserContext } from '@playwright/test';
import path from 'path';

const browsers = [
  { name: 'Chrome', channel: undefined, shouldPass: true },
  { name: 'Edge', channel: 'msedge' as const, shouldPass: false }
];

browsers.forEach(({ name, channel, shouldPass }) => {
  test.describe(`Export Functionality - ${name}`, () => {
    const extensionPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../resources/apiseccapture 2');
    let context: BrowserContext;
    let extensionId: string;

    test.setTimeout(90000);

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

      if (channel) {
        launchOptions.channel = channel;
      }

      context = await chromium.launchPersistentContext('', launchOptions);

      const page = await context.newPage();
      await page.waitForTimeout(2000);
      
      const serviceWorkers = context.serviceWorkers();
      const swUrl = serviceWorkers[0]?.url();
      extensionId = swUrl?.match(/chrome-extension:\/\/([a-zA-Z0-9]+)\//)?.[1]!;
      
      await page.close();
    });

    test.afterEach(async () => {
      await context.close();
    });

    const testFn = shouldPass ? test : test.fail;

    testFn('should export captured data', async () => {
      // Your export test implementation
    });
  });
});