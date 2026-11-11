import { beforeEach, describe, expect, test } from 'e2e';

describe('Up Next', () => {
  beforeEach(async ({ app, agent, screen }) => {
    await app.open();
    await agent.act('open the Up Next queue');
    await expect(screen.getByRole('button', 'Remove Testing Mobile Apps End to End from queue')).toBeVisible();
  });

  test('reorder the queue', async ({ agent, screen }) => {
    await agent.act('move The Perfect Weeknight Pasta to the top of the queue');

    await expect(screen.getByRole('button', 'Move The Perfect Weeknight Pasta up')).toBeDisabled();
    await expect(screen.getByRole('button', 'Move Testing Mobile Apps End to End down')).toBeDisabled();
  });

  test('remove an episode from the queue', async ({ agent, screen }) => {
    await agent.act('remove Testing Mobile Apps End to End from the queue');

    await expect(screen.getByRole('button', 'Remove Testing Mobile Apps End to End from queue')).toHaveCount(0);
    await expect(screen.getByRole('button', 'Remove The Perfect Weeknight Pasta from queue')).toBeVisible();
  });

  test('clear the queue', async ({ agent, screen }) => {
    await agent.act('clear the queue');

    await expect(screen.getByText('Add episodes to Up Next and they’ll play automatically.')).toBeVisible();
  });

  test('play an episode from the queue', async ({ agent, screen }) => {
    await agent.act('play The Perfect Weeknight Pasta');

    await expect(screen.getByText('Playing · Kitchen Table')).toBeVisible();
    await expect(screen.getByRole('button', 'Remove The Perfect Weeknight Pasta from queue')).toHaveCount(0);
  });
});
