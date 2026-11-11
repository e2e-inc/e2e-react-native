import { beforeEach, describe, expect, test } from 'e2e';

describe('search', () => {
  beforeEach(async ({ app }) => {
    await app.open();
  });

  test('find a show by name', async ({ agent, screen }) => {
    await agent.act('search for {query}', { params: { query: 'trail' } });

    await expect(screen.getByRole('button', 'Trail Notes')).toBeVisible();
  });

  test('browse shows in a category', async ({ agent, screen }) => {
    await agent.act('open the Comedy category');

    await expect(screen.getByRole('button', 'Laugh Track')).toBeVisible();
  });
});
