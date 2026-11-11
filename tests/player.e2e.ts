import { beforeEach, describe, expect, test } from 'e2e';

describe('full player', () => {
  beforeEach(async ({ app, agent, screen }) => {
    await app.open();
    await agent.act('open the full player');
    await expect(screen.getByTestId('player-title')).toHaveText('The Agents Are Coming for Your Test Suite');
  });

  test('start playback', async ({ agent, screen }) => {
    await agent.act('start playback');

    await expect(screen.getByTestId('player-toggle')).toHaveAccessibleName('Pause');
  });

  test('pause playback', async ({ agent, screen }) => {
    await agent.act('start playback');
    await expect(screen.getByTestId('player-toggle')).toHaveAccessibleName('Pause');

    await agent.act('pause playback');

    await expect(screen.getByTestId('player-toggle')).toHaveAccessibleName('Play');
  });

  test('skip forward', async ({ agent, screen }) => {
    await expect(screen.getByTestId('elapsed-time')).toHaveText('12:34');

    await agent.act('skip forward 30 seconds');

    await expect(screen.getByTestId('elapsed-time')).toHaveText('13:04');
  });

  test('change the playback speed', async ({ agent, screen }) => {
    await expect(screen.getByTestId('speed-button')).toHaveAccessibleName('Playback speed 1×');

    await agent.act('change the playback speed to {speed}', { params: { speed: '1.5×' } });

    await expect(screen.getByTestId('speed-button')).toHaveAccessibleName('Playback speed 1.5×');
  });

  test('jump to a chapter', async ({ agent, screen }) => {
    await expect(screen.getByText('Chapter · The big idea')).toBeVisible();

    await agent.act('jump to the Deep dive chapter');

    await expect(screen.getByText('Chapter · Deep dive')).toBeVisible();
    await expect(screen.getByTestId('elapsed-time')).toHaveText('19:15');
  });

  test('set a sleep timer', async ({ agent, screen }) => {
    await expect(screen.getByRole('button', 'Sleep timer: off')).toBeVisible();

    await agent.act('set the sleep timer to 15 minutes');

    await expect(screen.getByText('Sleep timer · 15:00 left')).toBeVisible();
  });
});
