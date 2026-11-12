import { beforeEach, describe, expect, test } from 'e2e';

describe('show page', () => {
  beforeEach(async ({ app, agent, screen }) => {
    await app.open();
    await agent.act('open the Trail Notes show from Search');
    await expect(screen.getByTestId('show-title')).toHaveText('Trail Notes');
  });

  test('follow a show', async ({ agent, screen }) => {
    await agent.act('follow the show');

    await expect(screen.getByRole('button', 'Following')).toBeVisible();
  });

  test('find a followed show in the Library', async ({ agent, screen }) => {
    await agent.act('follow the show');
    await agent.act('open the shows in your Library, and stay on the list');

    await expect(screen.getByRole('button', 'Trail Notes')).toBeVisible();
  });

  test('write a review', async ({ agent, screen }) => {
    await agent.act('open the Reviews tab');
    await expect(screen.getByRole('button', 'Write a review')).toBeVisible();

    await agent.act('write a {stars}-star review titled {title} that says {body}', {
      params: { stars: 5, title: 'Perfect for long walks', body: 'Calm, beautiful field recordings.' },
    });

    await expect(screen.getByRole('button', 'Edit review')).toBeVisible();
    await expect(screen.getByText('Perfect for long walks')).toBeVisible();
  });
});
