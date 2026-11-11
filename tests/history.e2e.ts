import { beforeEach, describe, expect, test } from 'e2e';

describe('listening history', () => {
  beforeEach(async ({ app, agent, screen }) => {
    await app.open();
    await agent.act('open your listening history in the Library');
    await expect(screen.getByRole('button', 'Clear history')).toBeVisible();
  });

  test('clear listening history', async ({ agent, screen }) => {
    await agent.act('clear your listening history');

    await expect(screen.getByText('No history yet')).toBeVisible();
  });
});
