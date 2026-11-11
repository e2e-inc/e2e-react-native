import { beforeEach, describe, expect, test } from 'e2e';

describe('playlists', () => {
  beforeEach(async ({ app }) => {
    await app.open();
  });

  test('create a playlist', async ({ agent }) => {
    await agent.act('create a new playlist named {name} from the Library', { params: { name: 'Road trip' } });

    await agent.assert('a playlist named {name} was created: a confirmation names it, or your playlists list it', {
      params: { name: 'Road trip' },
    });
  });

  test('find a created playlist in your playlists', async ({ agent, screen }) => {
    await agent.act('create a new playlist named {name} from the Library', { params: { name: 'Road trip' } });
    await agent.act('show your playlists');

    await expect(screen.getByRole('button', 'Playlist Road trip')).toBeVisible();
  });

  test('play a whole playlist', async ({ agent, screen }) => {
    await agent.act('open the Morning commute playlist from the Library');
    await expect(screen.getByRole('heading', 'Morning commute')).toBeVisible();

    await agent.act('play all episodes in the playlist');

    await expect(screen.getByTestId('mini-player')).toHaveAccessibleName('Now playing: Markets Rally as Rates Hold Steady');
    await expect(screen.getByTestId('mini-player-toggle')).toHaveAccessibleName('Pause');
  });

  // The delete confirmation is a native alert, which react-native-web does not render.
  test('delete a playlist', { platforms: ['ios', 'android'] }, async ({ agent, screen }) => {
    await agent.act('open the Morning commute playlist from the Library');
    await expect(screen.getByRole('heading', 'Morning commute')).toBeVisible();

    await agent.act('delete the playlist');

    await expect(screen.getByRole('button', 'Playlist Morning commute')).toHaveCount(0);
    await expect(screen.getByRole('button', 'Create a playlist')).toBeVisible();
  });
});
