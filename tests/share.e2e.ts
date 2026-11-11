import { beforeEach, describe, expect, test } from 'e2e';

describe('episode share sheet', () => {
  beforeEach(async ({ app, agent, screen }) => {
    await app.open();
    await agent.act('open the share sheet for the episode in the full player, without sharing it yet');
    await expect(screen.getByTestId('share-title')).toHaveText('Share episode');
  });

  test('links to the current position', async ({ screen }) => {
    await expect(screen.getByRole('switch', 'Start at 12:34')).toBeChecked();
    await expect(screen.getByText('podcasts.example.com/episode/signal-and-noise-106?t=754')).toBeVisible();
  });

  test('share without the timestamp', async ({ agent, screen }) => {
    await agent.act('turn off Start at 12:34');

    await expect(screen.getByText('podcasts.example.com/episode/signal-and-noise-106')).toBeVisible();
  });

  test('send to a friend', async ({ agent, screen }) => {
    await agent.act('send the episode to Olivia');

    await expect(screen.getByRole('button', 'Sent to Olivia')).toBeVisible();
  });
});
