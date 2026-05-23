import { test, expect } from '@playwright/test';
import { TodoPage } from './TodoPage';

let todoPage: TodoPage;
const задачи = ['купить хлеб', 'купить молоко', 'купить яйца'];

test.beforeEach(async ({ page }) => {
  todoPage = new TodoPage(page);
  await todoPage.открыть();
});

test.describe('Добавление задач', () => {
  test('Добавить задачу', async () => {
    await todoPage.добавитьЗадачу('купить хлеб');
    await expect(todoPage.заголовокЗадачи.first()).toHaveText('купить хлеб');
  });

  test('Добавить задачу пустую', async () => {
    await todoPage.добавитьЗадачу('');
    await expect(todoPage.заголовокЗадачи).toHaveCount(0);
  });
});

test.describe('Удаление задач', () => {
  test.describe('с предустановленной задачей', () => {
    test.beforeEach(async () => {
      await todoPage.добавитьЗадачу('купить хлеб');
    });
    test(`Удалить задачу`, async () => {
      await todoPage.удалитьЗадачу();
      await expect(todoPage.заголовокЗадачи).toHaveCount(0);
    });
  });

  test.describe('Удаление задач по одному', () => {
    // const задачи = ['купить хлеб', 'купить молоко', 'купить яйца'];

    for (const задача of задачи) {
      test(`Удалить задачу: ${задача}`, async () => {
        await todoPage.добавитьЗадачу(задача);
        await todoPage.удалитьЗадачу();

        await expect(todoPage.заголовокЗадачи).toHaveCount(0);
      });
    }
  });

  test.describe('Удаление задачи по тексту', () => {
    test(`Удалить задачу по тексту`, async () => {
      for (const задача of задачи) {
        await todoPage.добавитьЗадачу(задача);
      }
      await todoPage.удалитьЗадачуПоТексту('купить молоко');

      await expect(todoPage.заголовокЗадачи).toHaveCount(2);

      await expect(todoPage.заголовокЗадачи.filter({ hasText: 'купить молоко' })).toHaveCount(0);
      await expect(todoPage.заголовокЗадачи.filter({ hasText: 'купить хлеб' })).toHaveCount(1);
    });
  });
});

test('Отметить задачу как выполненную', async () => {
  await todoPage.добавитьЗадачу('купить хлеб');
  await todoPage.отметитьВыполненной();

  await expect(todoPage.элементЗадачи.first()).toHaveClass(/completed/);
});
