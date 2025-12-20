import { Page, Locator, Download } from '@playwright/test';
import AdmZip from 'adm-zip';

export class ExtensionPanel {
  readonly page: Page;
  readonly extensionId: string;
  readonly startButton: Locator;
  readonly stopButton: Locator;
  readonly exportButton: Locator;
  clearCapturedData: any;

  constructor(page: Page, extensionId: string) {
    this.page = page;
    this.extensionId = extensionId;
    this.startButton = page.locator('button#start-button');
    this.stopButton = page.locator('button:has-text("Stop")');
    this.exportButton = page.locator('button#stripe-download-oas');
  }

  async goto() {
    await this.page.goto(`chrome-extension://${this.extensionId}/panel.html`);
    await this.page.waitForTimeout(1000);
  }

  async startCapture() {
    await this.startButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.startButton.click();
  }

  async stopCapture() {
    const isVisible = await this.stopButton.isVisible().catch(() => false);
    if (isVisible) {
      await this.stopButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async exportOAS(): Promise<Download> {
    await this.exportButton.waitFor({ state: 'visible', timeout: 5000 });
    const isEnabled = await this.exportButton.isEnabled();
    if (!isEnabled) throw new Error('Export button is not enabled.');
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportButton.click();
    return await downloadPromise;
  }

  async exportAndParseOAS(): Promise<any> {
    const download = await this.exportOAS();
    const zip = new AdmZip((await download.path())!);
    const oasEntry = zip.getEntries().find(e => e.entryName.includes('.json'));
    return JSON.parse(oasEntry!.getData().toString('utf-8'));
  }

  async isExportButtonDisabled(): Promise<boolean> {
    return await this.exportButton.isDisabled();
  }

  async isExportButtonVisible(): Promise<boolean> {
    return await this.exportButton.isVisible();
  }

  async reload() {
    await this.page.reload();
    await this.page.waitForTimeout(1000);
  }

  async close() {
    if (!this.page.isClosed()) {
      await this.page.close();
    }
  }

  isClosed(): boolean {
    return this.page.isClosed();
  }

  async rapidStartClicking(iterations: number = 10) {
    console.log(`🏁 Race condition test: ${iterations} simultaneous START clicks`);
    
    // Fire all clicks simultaneously (no await, no recovery)
    const clickPromises = [];
    for (let i = 0; i < iterations; i++) {
      console.log(`   🚀 Firing click ${i + 1}`);
      clickPromises.push(
        this.startButton.click({ timeout: 1000 }).catch(err => {
          console.log(`   ❌ Click ${i + 1} failed: ${err.message}`);
          return false;
        })
      );
    }
    
    // Wait for all clicks to complete
    const results = await Promise.allSettled(clickPromises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value !== false).length;
    
    await this.page.waitForTimeout(1000);
    
    console.log(`\n📊 Summary: ${successful}/${iterations} clicks completed`);
    console.log(`   Page status: ${this.page.isClosed() ? 'CLOSED ❌' : 'OPEN ✅'}`);
    
    return successful;
  }
}