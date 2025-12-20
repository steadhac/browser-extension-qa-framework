import { Page, Locator } from '@playwright/test';

/**
 * GraphQL Playground Page Object
 * Handles interactions with GraphQL query editors (like GraphiQL)
 */
export class GraphQLPlayground {
  readonly page: Page;
  readonly queryEditor: Locator;
  readonly executeButton: Locator;
  readonly resultsPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.queryEditor = page.locator('.graphiql-editor, .CodeMirror, [role="textbox"]').first();
    this.executeButton = page.locator('button.graphiql-execute-button'); // Updated selector
    this.resultsPanel = page.locator('.result-window, .graphiql-response').first();
  }

  async goto(url: string) {
    await this.page.goto(url);
    await this.page.waitForTimeout(2000);
  }

  async typeQuery(query: string) {
    // Clear existing query first
    await this.queryEditor.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    
    // Type new query
    await this.page.keyboard.type(query, { delay: 50 });
    console.log('✅ Query typed into editor');
  }

  async executeQuery() {
    await this.executeButton.click();
    await this.page.waitForTimeout(1000);
    console.log('✅ Query executed');
  }

  async getResults(): Promise<string> {
    await this.resultsPanel.waitFor({ state: 'visible', timeout: 5000 });
    const results = await this.resultsPanel.textContent();
    return results || '';
  }

  async executeQueryAndGetResults(query: string): Promise<string> {
    await this.typeQuery(query);
    await this.executeQuery();
    return await this.getResults();
  }

  async isEditorVisible(): Promise<boolean> {
    return await this.queryEditor.isVisible();
  }
}