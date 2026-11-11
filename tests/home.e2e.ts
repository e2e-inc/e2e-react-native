import { beforeEach, describe, expect, test } from 'e2e';

describe('home', () => {
  beforeEach(async ({ app }) => {
    await app.open();
  });

  test('play the latest episode of a featured show', async ({ agent, screen }) => {
    await agent.act('play the latest episode of Deep Space Diaries');

    await expect(screen.getByTestId('mini-player')).toHaveAccessibleName('Now playing: Listening for Life on Europa');
    await expect(screen.getByTestId('mini-player-toggle')).toHaveAccessibleName('Pause');
  });

  test('unfollow a featured show', async ({ agent, screen }) => {
    await agent.act('unfollow Signal & Noise');

    await expect(screen.getByRole('button', 'Follow Signal & Noise')).toBeVisible();
  });
});
