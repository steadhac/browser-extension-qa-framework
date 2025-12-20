import { chromium, BrowserContext } from '@playwright/test';
import path from 'path';

/**
 * Extension Loader Utility
 * Provides reusable functions for loading and managing browser extensions in tests
 */

export interface ExtensionConfig {
  extensionPath: string;
  headless?: boolean;
  channel?: 'chrome' | 'msedge';
  timeout?: number;
}

/**
 * Launch browser with extension loaded
 * @param config Extension configuration
 * @returns Browser context with extension loaded
 */
export async function launchBrowserWithExtension(
  config: ExtensionConfig
): Promise<BrowserContext> {
  const launchOptions: any = {
    headless: config.headless || false,
    args: [
      `--disable-extensions-except=${config.extensionPath}`,
      `--load-extension=${config.extensionPath}`,
      '--enable-extension-activity-logging'
    ],
    ignoreDefaultArgs: ['--disable-extensions'],
    acceptDownloads: true
  };

  if (config.channel) {
    launchOptions.channel = config.channel;
  }

  return await chromium.launchPersistentContext('', launchOptions);
}

/**
 * Extract extension ID from service worker URL
 * @param context Browser context with extension loaded
 * @returns Extension ID string
 */
export async function getExtensionId(context: BrowserContext): Promise<string> {
  const page = await context.newPage();
  await page.waitForTimeout(2000);
  
  const serviceWorkers = context.serviceWorkers();
  
  if (serviceWorkers.length === 0) {
    await page.close();
    throw new Error('No service workers found. Extension may not have loaded.');
  }
  
  const swUrl = serviceWorkers[0].url();
  const extensionId = swUrl?.match(/chrome-extension:\/\/([a-zA-Z0-9]+)\//)?.[1];
  
  await page.close();
  
  if (!extensionId) {
    throw new Error(`Failed to extract extension ID from URL: ${swUrl}`);
  }
  
  return extensionId;
}

/**
 * Get default extension path for tests
 * @returns Absolute path to extension
 */
export function getDefaultExtensionPath(): string {
  return path.join(__dirname, '../../resources/apiseccapture 2');
}

/**
 * Verify extension is loaded correctly
 * @param context Browser context
 * @returns True if extension loaded successfully
 */
export async function verifyExtensionLoaded(context: BrowserContext): Promise<boolean> {
  try {
    const serviceWorkers = context.serviceWorkers();
    
    if (serviceWorkers.length === 0) {
      console.error('❌ No service workers found');
      return false;
    }
    
    const swUrl = serviceWorkers[0].url();
    const isExtension = swUrl.includes('chrome-extension://');
    
    if (isExtension) {
      console.log('✅ Extension loaded:', swUrl);
    } else {
      console.error('❌ Service worker is not an extension:', swUrl);
    }
    
    return isExtension;
  } catch (error) {
    console.error('❌ Error verifying extension:', error);
    return false;
  }
}

/**
 * Wait for extension to initialize
 * @param context Browser context
 * @param timeout Maximum wait time in ms (default: 5000)
 */
export async function waitForExtensionReady(
  context: BrowserContext,
  timeout: number = 5000
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const serviceWorkers = context.serviceWorkers();
    
    if (serviceWorkers.length > 0) {
      console.log('✅ Extension ready');
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error(`Extension did not load within ${timeout}ms`);
}