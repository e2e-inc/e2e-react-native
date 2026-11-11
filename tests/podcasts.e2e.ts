import { test } from '@e2e-dev/mobile';
import { expect } from 'e2e';

test('discover a show through search and follow it', async ({ app, screen }) => {
  await app.open();
  await screen.getByRole('tab', 'Search').tap();
  await screen.getByRole('textbox', 'Search podcasts').fill('trail');
  await screen.getByRole('button', 'Trail Notes').tap();
  await expect(screen.getByRole('button', 'Share show')).toBeVisible();

  await screen.getByRole('button', 'Follow').tap();
  await expect(screen.getByRole('button', 'Following')).toBeVisible();
  await expect(screen.getByRole('button', 'Turn off new episode alerts')).toBeVisible();

  await screen.getByRole('button', 'Back').tap();
  await screen.getByRole('tab', 'Library').tap();
  await expect(screen.getByRole('tab', 'Library')).toBeSelected();
  await expect(screen.getByRole('button', 'Trail Notes')).toBeVisible();
});

test('play an episode and control playback in the full player', async ({ app, screen }) => {
  await app.open();
  await screen.getByRole('button', 'Play latest Signal & Noise').tap();
  await expect(screen.getByTestId('mini-player-toggle')).toHaveAccessibleName('Pause');
  await screen.getByRole('button', 'Now playing: The Agents Are Coming for Your Test Suite').tap();
  await expect(screen.getByTestId('player-title')).toHaveText('The Agents Are Coming for Your Test Suite');

  await screen.getByTestId('player-toggle').tap();
  await expect(screen.getByTestId('player-toggle')).toHaveAccessibleName('Play');

  const before = await screen.getByTestId('elapsed-time').textContent();
  await screen.getByRole('button', 'Skip forward 30 seconds').tap();
  await expect(screen.getByTestId('elapsed-time')).not.toHaveText(before ?? '');

  await screen.getByTestId('speed-button').tap();
  await expect(screen.getByTestId('speed-button')).toHaveAccessibleName('Playback speed 1.25×');

  await screen.getByRole('button', 'Sleep timer: off').tap();
  await screen.getByRole('button', 'End of episode').tap();
  await expect(screen.getByText('Sleep timer · end of episode')).toBeVisible();

  await screen.getByTestId('player-scroll').scrollUntilVisible(screen.getByRole('button', 'Jump to Deep dive'));
  await screen.getByRole('button', 'Jump to Deep dive').tap();
  await expect(screen.getByText('Chapter · Deep dive')).toBeVisible();
  await expect(screen.getByTestId('elapsed-time')).toHaveText('19:15');

  await screen.getByRole('button', 'Close player').tap();
  await expect(screen.getByTestId('mini-player')).toBeVisible();
});

test('queue an episode and save it to a new playlist', async ({ app, screen }) => {
  await app.open();
  await screen.getByRole('tab', 'Search').tap();
  await screen.getByRole('textbox', 'Search podcasts').fill('marathon');
  await screen.getByRole('button', 'Episode Training for Your First Marathon').tap();

  await screen.getByRole('button', 'Up Next').tap();
  await expect(screen.getByRole('button', 'Queued')).toBeSelected();

  await screen.getByRole('button', 'Playlist').tap();
  await screen.getByRole('button', 'New playlist').tap();
  await screen.getByRole('textbox', 'Playlist name').fill('Long runs');
  await screen.getByRole('button', 'Create playlist').tap();
  await expect(screen.getByRole('checkbox', 'Long runs')).toBeChecked();
  await screen.getByRole('button', 'Done').tap();

  await screen.getByRole('button', 'Back').tap();
  await screen.getByRole('tab', 'Library').tap();
  await screen.getByRole('button', 'Up Next').tap();
  await expect(screen.getByRole('button', 'Move Training for Your First Marathon down')).toBeDisabled();
  await screen.getByRole('button', 'Move Training for Your First Marathon up').tap();
  await expect(screen.getByRole('button', 'Move Training for Your First Marathon down')).toBeEnabled();

  await screen.getByRole('button', 'Back').tap();
  await screen.getByRole('button', 'Playlists').tap();
  await screen.getByRole('button', 'Playlist Long runs').tap();
  await expect(screen.getByText('1 episode · 46 min')).toBeVisible();
  await expect(screen.getByRole('button', 'Episode Training for Your First Marathon')).toBeVisible();
});

test('share an episode from the player at the current timestamp', async ({ app, screen }) => {
  await app.open();
  await screen.getByTestId('mini-player').tap();
  await screen.getByRole('button', 'Share episode').tap();
  await expect(screen.getByText('podcasts.example.com/episode/signal-and-noise-106?t=754')).toBeVisible();

  await screen.getByRole('switch', 'Start at 12:34').uncheck();
  await expect(screen.getByText('podcasts.example.com/episode/signal-and-noise-106')).toBeVisible();
  await screen.getByRole('switch', 'Start at 12:34').check();

  await screen.getByRole('button', 'Send to Olivia').tap();
  await expect(screen.getByRole('button', 'Sent to Olivia')).toBeVisible();

  await screen.getByRole('button', 'Messages').tap();
  await expect(screen.getByTestId('player-screen')).toBeVisible();
});

test('save an episode, review its show, and tune interests', async ({ app, screen }) => {
  await app.open();
  await screen.getByTestId('mini-player').tap();
  await screen.getByRole('button', 'Save episode').tap();
  await expect(screen.getByRole('button', 'Remove from Saved')).toBeSelected();

  await screen.getByRole('link', 'Go to Signal & Noise').tap();
  await screen.getByRole('button', 'Reviews').tap();
  await screen.getByRole('button', 'Write a review').tap();
  await screen.getByRole('button', '5 stars').tap();
  await screen.getByRole('textbox', 'Review title').fill('Sharp and timely');
  await screen.getByTestId('review-body').fill('Great guests every week.');
  await screen.getByRole('button', 'Submit review').tap();
  await expect(screen.getByRole('button', 'Edit review')).toBeVisible();
  await expect(screen.getByText('Sharp and timely')).toBeVisible();

  await screen.getByRole('button', 'Back').tap();
  await screen.getByRole('tab', 'Library').tap();
  await screen.getByRole('button', 'Saved').tap();
  await expect(screen.getByRole('button', 'Episode The Agents Are Coming for Your Test Suite')).toBeVisible();

  await screen.getByRole('tab', 'Profile').tap();
  await screen.getByRole('button', 'Comedy').tap();
  await expect(screen.getByRole('button', 'Comedy')).toBeSelected();
  await screen.getByRole('tab', 'Home').tap();
  await screen.getByTestId('home-screen').scrollUntilVisible(screen.getByText('Because you like Comedy'));
  await expect(screen.getByRole('button', 'Laugh Track')).toBeVisible();
});
