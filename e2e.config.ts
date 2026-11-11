import type { E2EConfig } from 'e2e';
import { mobile } from '@e2e-dev/mobile';
import { web } from '@e2e-dev/web';
import { gateway } from 'ai';

// One Metro server serves the iOS bundle and the web app; targets declaring the same command share it.
const metro = {
  executable: 'npx',
  args: ['expo', 'start', '--port', '8081'],
  reuseExisting: true,
  startupTimeout: 120_000,
  log: '.e2e/logs/metro.log',
};

export default {
  // The Vercel AI Gateway serves the model id and reads AI_GATEWAY_API_KEY, or the OIDC token of a linked Vercel project.
  agents: {
    default: {
      model: gateway('openai/gpt-6-luna-fast'),
      system: 'You are a thorough QA agent. Verify every outcome.',
    },
  },
  // Pick one with --target, or the test:e2e:ios and test:e2e:web scripts.
  targets: [
    {
      name: 'ios',
      engine: mobile({ platform: 'ios', device: 'iPhone 17 Pro' }),
      // A development build made with `npx expo run:ios`; Metro serves the JS bundle.
      app: {
        bundleId: 'dev.e2e.podcasts',
        launchArguments: [
          '--initialUrl',
          'http://localhost:8081',
          '-EXDevMenuShowsAtLaunch',
          'NO',
          '-EXDevMenuIsOnboardingFinished',
          'YES',
          '-EXDevMenuShowFloatingActionButton',
          'NO',
        ],
        command: metro,
        readyUrl: 'http://localhost:8081/status',
      },
    },
    {
      name: 'web',
      // A phone-sized viewport, so the web app lays out like the mobile one.
      engine: web({ viewport: { width: 402, height: 874 }, colorScheme: 'dark' }),
      app: {
        url: 'http://localhost:8081',
        command: metro,
        readyUrl: 'http://localhost:8081/status',
      },
    },
  ],
  workers: 3,
} satisfies E2EConfig;
