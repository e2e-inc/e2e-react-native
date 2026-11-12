import { beforeEach, describe, expect, test } from 'e2e';

describe('interests', () => {
  beforeEach(async ({ app }) => {
    await app.open();
  });

  test('add an interest on your profile', async ({ agent, screen }) => {
    await agent.act('add Comedy to your interests on your profile');

    await expect(screen.getByRole('button', 'Comedy')).toBeSelected();
  });

  test('tailor Home to an added interest', async ({ agent, screen }) => {
    await agent.act('add Comedy to your interests on your profile');
    await agent.act('go to Home');
    await screen.getByTestId('home-screen').scrollUntilVisible(screen.getByText('Because you like Comedy', { visible: true }));

    await expect(screen.getByText('Because you like Comedy', { visible: true })).toBeVisible();
  });
});
