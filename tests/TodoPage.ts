import { Page, Locator } from '@playwright/test'; // expect убрали — он не нужен здесь

export class TodoPage {
  readonly page: Page;
  readonly поле: Locator;
  readonly заголовокЗадачи: Locator;
  readonly чекбокс: Locator;
  readonly элементЗадачи: Locator;
  readonly кнопкаУдалить: Locator;

  constructor(page: Page) {
    this.page = page;
    this.поле = page.getByPlaceholder('What needs to be done?');
    this.заголовокЗадачи = page.getByTestId('todo-title');
    this.чекбокс = page.getByRole('checkbox', { name: 'Toggle Todo' });
    this.элементЗадачи = page.getByTestId('todo-item');
    this.кнопкаУдалить = page.getByRole('button', { name: 'Delete' });
  }

  async открыть() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async добавитьЗадачу(текст: string) {
    await this.поле.fill(текст);
    await this.поле.press('Enter');
  }

  async отметитьВыполненной() {
    await this.чекбокс.check();
  }

  async удалитьЗадачу() {
    await this.элементЗадачи.first().hover();
    await this.кнопкаУдалить.click();
  }

  async удалитьЗадачуПоТексту(текст: string) {
    const задача = this.элементЗадачи.filter({ hasText: текст });
    await задача.first().hover();
    await задача.getByRole('button', { name: 'Delete' }).click();
  }
}
