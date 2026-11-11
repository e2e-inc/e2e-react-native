import { beforeEach, describe, expect, test } from 'e2e';

describe('settings', () => {
  beforeEach(async ({ app, agent, screen }) => {
    await app.open();
    await agent.act('open the playback settings');
    await expect(screen.getByRole('switch', 'Continuous playback')).toBeVisible();
  });

  test('change the skip forward interval', async ({ agent, screen }) => {
    await agent.act('set skip forward to {seconds} seconds', { params: { seconds: 45 } });

    await expect(screen.getByRole('button', '45s')).toBeSelected();
    await expect(screen.getByRole('button', 'Skip forward 45 seconds')).toBeVisible();
  });

  test('turn off continuous playback', async ({ agent, screen }) => {
    await expect(screen.getByRole('switch', 'Continuous playback')).toBeChecked();

    await agent.act('turn off continuous playback');

    await expect(screen.getByRole('switch', 'Continuous playback')).not.toBeChecked();
  });
});
