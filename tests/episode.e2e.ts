import { beforeEach, describe, expect, test } from 'e2e';

describe('episode page', () => {
  beforeEach(async ({ app, agent, screen }) => {
    await app.open();
    await agent.act('open the episode {title} from Home', { params: { title: 'Listening for Life on Europa' } });
    await expect(screen.getByRole('heading', 'Listening for Life on Europa')).toBeVisible();
  });

  test('save an episode', async ({ agent, screen }) => {
    await agent.act('save the episode');

    await expect(screen.getByRole('button', 'Saved')).toBeSelected();
  });

  test('find a saved episode in the Library', async ({ agent, screen }) => {
    await agent.act('save the episode');
    await agent.act('open the saved episodes in your Library');

    await expect(screen.getByRole('button', 'Episode Listening for Life on Europa')).toBeVisible();
  });

  test('download an episode', async ({ agent, screen }) => {
    await agent.act('download the episode');

    await expect(screen.getByRole('button', 'Downloaded')).toBeVisible({ timeout: 10_000 });
  });

  test('find a downloaded episode in the Library', async ({ agent, screen }) => {
    await agent.act('download the episode');
    await agent.act('open the downloads in your Library');

    await expect(screen.getByText(/^2 episodes · \d+ MB on this device$/)).toBeVisible();
    await expect(screen.getByRole('button', 'Episode Listening for Life on Europa')).toBeVisible();
  });

  test('mark an episode as played', async ({ agent, screen }) => {
    await agent.act('mark the episode as played');

    await expect(screen.getByRole('button', 'Mark as unplayed')).toBeVisible();
  });

  test('add an episode to Up Next', async ({ agent, screen }) => {
    await agent.act('add the episode to Up Next');

    await expect(screen.getByRole('button', 'Queued')).toBeSelected();
  });

  test('find an episode added to Up Next in the queue', async ({ agent, screen }) => {
    await agent.act('add the episode to Up Next');
    await agent.act('open the Up Next queue');

    await expect(screen.getByRole('button', 'Remove Listening for Life on Europa from queue')).toBeVisible();
  });

  test('add an episode to a playlist', async ({ agent, screen }) => {
    await agent.act('tick Morning commute in the Add to playlist sheet, and leave the sheet open');

    await expect(screen.getByRole('checkbox', 'Morning commute')).toBeChecked();
  });

  test('find an episode in the playlist it was added to', async ({ agent, screen }) => {
    await agent.act('tick Morning commute in the Add to playlist sheet, and leave the sheet open');
    await agent.act('open the Morning commute playlist from the Library');

    await expect(screen.getByRole('heading', 'Morning commute')).toBeVisible();
    await expect(screen.getByRole('button', 'Episode Listening for Life on Europa')).toBeVisible();
  });
});
