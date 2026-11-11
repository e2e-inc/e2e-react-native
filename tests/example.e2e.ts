import { test } from '@e2e-dev/mobile';
import { expect } from 'e2e';

test('Settings opens', async ({ app, screen }) => {
  await app.open();
  await expect(screen.getByRole('button', 'General')).toBeVisible();
});

// With the model key in the environment, uncomment:
// test('the agent opens General', async ({ agent, app, device }) => {
//   await app.open();
//   await agent.act('open General settings');
//   await expect(device.locator('role=NavigationBar id=General')).toBeVisible();
// });
